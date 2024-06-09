import express, { Request, Response, Router } from 'express';
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

import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";

const router = Router();

const pinecone = new Pinecone(
    {
        apiKey: PINECONE_API_KEY,
    }
);

const googleEmbeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: GEMINI_API_KEY,
    modelName: 'embedding-001'
  });

const chat = new ChatGoogleGenerativeAI({ 
    apiKey: GEMINI_API_KEY,
    modelName: 'gemini-1.5-flash',
    temperature: 0
});

const chatPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(`
    Add an academic inclined prompt
    Insert the chat history here
    `),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{query}"),
  ]);

  async function initializeVectorStore(){
    const vectorStore = await PineconeStore.fromExistingIndex(
      googleEmbeddings,
      { pineconeIndex }
    );
    return vectorStore;
  }

  const chain = new ConversationChain({
    prompt: chatPrompt,
    llm: chat,
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history", inputKey: "query"}),
  });

  async function getResponse(query, vectorEmbeddings){
    const response = await chain.call({ query: query, embeddings: vectorEmbeddings });
    return response;
  }

  //Create a route for handling image queries and pdf queries

  router.get('/', (req, res) => {
    res.send('Gemini Chat Bot');
  });

  router.post('/query', async (req, res) => {

    //Here need to get the list of indices from the chat and then
    const query = req.body.query;
    try{
        const results = await (await pineStore).similaritySearch(query, 10000);
        const vectorEmbeddings = results.map((result) => result.pageContent).join("/n");
        console.log(vectorEmbeddings);
        const response = await getResponse(query, vectorEmbeddings);
        res.json(response);
    } catch(error){
        console.log(error);
    }
    });
