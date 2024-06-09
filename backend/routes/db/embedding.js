//Handle file uploades and create embeddings for each file in pine cone
import express, { Request, Response, Router } from 'express';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import User from '../../models/user.js';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { PDFExtract } from 'pdf.js-extract';

import dotenv from 'dotenv';
dotenv.config();

let {MONGODB_URL, GEMINI_API_KEY, PINECONE_API_KEY, PINECONE_ENVIRONMENT } = process.env;

const router = Router();

const upload = multer({ dest: 'uploads/' });

async function fetchPDFTextChunks(pdfPath, linesPerChunk = 20) {
    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extractBuffer(pdfBuffer);
    const textChunks = [];
    let accumulator = "";
    let lineCounter = 0;

    for (const page of data.pages) {
        for (const content of page.content) {
            if (content.str) {
                accumulator += content.str.trim() + ' ';
                lineCounter++;
                if (lineCounter >= linesPerChunk) {
                    textChunks.push(accumulator.trim());
                    accumulator = "";
                    lineCounter = 0;
                }
            }
        }
    }

    if (accumulator.trim().length > 0) {
        textChunks.push(accumulator.trim());
    }

    return textChunks;
}

const pinecone = new Pinecone(
    {
        apiKey: PINECONE_API_KEY,
    }
);

const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: GEMINI_API_KEY,
    modelName: 'embedding-001'
});

//function to process the chunks
function chunkArray(array, chunkSize){
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

async function processFiles(email, files){
    files = [
        {
            filename: 'file1.txt',
            content: ['This is the content of file1.txt', 'This is the content of file1.txt']
        },
        {
            filename: 'file2.txt',
            content: ['This is the content of file2.txt','This is the content of file2.txt']
        }
    ]

    let indices = [];

    files.map(async (filename, content) => {

        const randomString = crypto.randomBytes(4).toString('hex');
        const titleChars = filename.substring(0, 4);
        const uniqueIndex = titleChars + randomString;

        await pc.createIndex({
            name: uniqueIndex,
            dimension: 768,
            metric: 'cosine',
            spec: {
                serverless: {
                cloud: 'aws',
                region: 'us-east-1'
                }
            }
        });

        const index = pinecone.Index(uniqueIndex);

        let records = []

        content.forEach((chunk) => {
            records.push(new Document({ pageContent: chunk, metadata: {} }))
        })

        const recordChunks = chunkArray(records, 5);

        for (const record of records) {
            try {
                await PineconeStore.fromDocuments(record, googleEmbeddings, {
                    index,
                    maxConcurrency: 5, 
                });
                console.log(`Processed batch of ${chunk.length} records`);
            } catch (error) {
                console.error('Error processing batch:', error);
            }
        }

        indices = [...indices, uniqueIndex]
    })

    let user = await User.findOne({ email });
    let newChat = {
        id:'',
        title:'',
        indices: indices,
        history: []
    }
    user.chats = [...user.chats, newChat];
    await user.save();
}

router.post('/', upload.array('pdfPaths'), async (req, res) => {
    try {
        const files = req.files; 
        const textChunksArray = [];

        for (const file of files) {
            const pdfPath = file.path; 
            const textChunks = await fetchPDFTextChunks(pdfPath);
            textChunksArray.push({ filename: file.originalname, chunks: textChunks });

           
            await fs.unlink(pdfPath);
        }

        res.json({ success: true, textChunksArray });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred while processing PDFs.' });
    }
});

export default router;