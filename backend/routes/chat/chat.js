import multer from 'multer';
import { processFiles } from './utils.js';
import {config} from "dotenv"
import express from 'express'
const { Request, Response, Router } = express;

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ConversationChain } from "langchain/chains";
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";
import User from '../../models/user';

import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
config()
const router = Router();
const upload = multer({ dest: 'uploads/images/' });

const pinecone = new Pinecone(
    {
        apiKey: process.env.PINECONE_API_KEY,
    }
);

const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: 'embedding-001'
  });

const chat = new ChatGoogleGenerativeAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    modelName: 'gemini-1.5-flash',
    temperature: 0
});

const chatPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(`
    Add an academic inclined prompt
    Insert the chat history here
    {history}
    `),
    HumanMessagePromptTemplate.fromTemplate("{query}"),
  ]);

  async function initializeVectorStore(pineconeIndex){
    const vectorStore = await PineconeStore.fromExistingIndex(
      googleEmbeddings,
      { pineconeIndex }
    );
    return vectorStore;
  }

  async function getResponse(chain, query, vectorEmbeddings, chatHistory){
    const response = await chain.call({ query: query, embeddings: vectorEmbeddings, history: chatHistory});
    return response;
  }

  //Create a route for handling image queries and pdf queries
  router.post('/imageupload', upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files.map(file => file.path);
      const textChunks = await processFiles(files); // Use the imported function
      console.log("this is at api call",textChunks)
      res.json({ success: true, textChunks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'An error occurred while processing images.' });
    }
  });


  router.get('/', (req, res) => {
    res.send('Gemini Chat Bot');
  });

  router.post('/query', async (req, res) => {
    const email = req.body.email;
    const chatId = req.body.chat;
    const query = req.body.query;

    let user = await User.findOne({ email });
    const indexNames = user.chats[chatId]

    const vectorEmbeddings = "";

    indexNames.map(async (indexName) => {
        const pineStore = initializeVectorStore(indexName);
        const results = await pineStore.similaritySearch(query, 10000);
        vectorEmbeddings = vectorEmbeddings + results.map((result) => result.pageContent).join("/n");
    })

    try{
        const chain = new ConversationChain({
            prompt: chatPrompt,
            llm: chat,
          });
        const response = await getResponse(chain, query, vectorEmbeddings);
        res.json(response);
    } catch(error){
        console.log(error);
    }
    });
export default router