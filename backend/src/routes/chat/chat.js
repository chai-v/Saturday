import multer from 'multer';
import { processFiles } from './utils.js';
import User from '../../models/user.js';
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

import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

config()
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

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
  You are an advanced AI assistant designed to help users with academic questions by utilizing embeddings from relevant notes. Your responses should be informative, concise, and helpful. Additionally, you should have a bit of personality, similar to the iconic Friday AI from Iron Man. You are professional yet approachable, and you occasionally incorporate a subtle touch of humor or wit.

  Instructions:

  1. Context: Use the following embeddings from relevant notes to inform your responses.
  {embeddings}
  
  2. Understanding the Query: Carefully analyze the user's question to understand what information is being requested. Make sure to clarify any ambiguities if needed.

  3. Using Notes: Integrate relevant information from the provided notes snippets. Ensure the information is accurate and directly addresses the user's query.

  4. Structured Response: Structure your response clearly, ensuring it is easy to follow. Break down complex information into understandable parts if necessary.

  5. Personality Integration: Infuse your responses with a touch of personality, mimicking Friday from Iron Man in a subtle manner. Be professional, but feel free to add subtle humor or witty remarks to make the interaction engaging. 
  
  Examples:
  When providing a complex answer: "Just like Tony Stark solving a tech problem, let’s break this down step-by-step."
  When offering encouragement: "You've got this! Even Stark started somewhere."
  When adding humor: "If I had a suit of armor for every time I saw this question, I'd be as rich as Stark himself."

  6. Tone and Style: Maintain a professional yet friendly tone. Your goal is to be both helpful and engaging.

  User Query Example: "Can you explain the key concepts of quantum mechanics?"
  Response Example:
  "Absolutely! Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. Imagine it as the rulebook for how particles like electrons and photons behave. The key concepts include wave-particle duality, quantization of energy, and the uncertainty principle. It's like the user manual for the tiny building blocks of the universe. Got it? Or should I channel more of my inner Stark for a deeper dive?"

  Chat history with the user so far:
  {chathistory}
  `),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{query}"),
]);

//Functions
async function initializeVectorStore(pineconeIndex){
  const vectorStore = await PineconeStore.fromExistingIndex(
    googleEmbeddings,
    { pineconeIndex }
  );
  return vectorStore;
}

async function getResponse(chain, query, vectorEmbeddings, chatHistory){
  const response = await chain.call({ query: query, embeddings: vectorEmbeddings, chathistory: chatHistory});
  return response;
}

async function generateResponse(email, chatId, query, history){
  let user = await User.findOne({ email });
  const indexNames = user.chats[chatId - 1].indices;

  let vectorEmbeddings = "";

  await Promise.all(
    indexNames.map(async (indexName) => {
      const pineconeIndex = pinecone.Index(indexName);
      const pineStore = await initializeVectorStore(pineconeIndex);
      const results = await pineStore.similaritySearch(query, 5);
      vectorEmbeddings += results.map((result) => result.pageContent).join("\n");
    })
  );

  console.log(vectorEmbeddings);

  try {
    const chain = new ConversationChain({
      prompt: chatPrompt,
      llm: chat,
      memory: new BufferMemory({ returnMessages: true, memoryKey: "history", inputKey: "query" }),
    });
    const response = await getResponse(chain, query, vectorEmbeddings, history);
    return response;
  } catch (error) {
    console.log(error);
  }
}


//Routes
router.get('/', (req, res) => {
  res.send('Gemini Chat Bot');
});

router.post('/query', async (req, res) => {
      try{
          const response = await generateResponse(req.body.email, req.body.chat, req.body.query, req.body.history);
          res.json(response);
      } catch (error){
          console.log(error);
      }
  });

router.post('/imageupload', upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files.map(file => file.buffer);
      const textChunks = await processFiles(files); 

      const prompt = "Answer the following list of questions in a concise manner. Ensure the answers are in a list format corresponding to their respective question from the list below.\n";
      let query = textChunks[0].chunks.join("\n");
      query = prompt.concat(query);
      const response = await generateResponse(req.body.email, req.body.chat, query, req.body.history);
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'An error occurred while processing images.' });
    }
  });
    
router.post('/updatechat', async (req, res) => {
  let {email, chat, history} = req.body;
  let user = await User.findOne({ email });
  user.chats[chat-1].history = history;
  await user.save();
  res.json({message: "Chat updated successfully"})
})

export default router