//Handle file uploades and create embeddings for each file in pine cone
//Update the mongodb cluster based on the user id and add the embeddings indices to the object


import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { PDFExtract } from 'pdf.js-extract';
const { Request, Response, Router } = express;

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

router.post('/', upload.array('pdfPaths'), async (req, res) => {
    try {
        const files = req.files; // Array of uploaded files
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





