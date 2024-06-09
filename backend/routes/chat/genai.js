//Chat bot with Google AI Studio and prompt modeling (no embeddings)
import { processFiles } from './utils.js';
import multer from 'multer';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from 'fs';

import express from 'express'
const { Request, Response, Router } = express;
const router = Router();
const upload = multer({ dest: 'uploads/images/' });

import dotenv from 'dotenv';

dotenv.config();
  
const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
  
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
});
  
const generationConfig = {
    temperature: 0.3,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};
  
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];
  
async function run(query) {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [
            {text: "Answer these questions in a brief manner"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage(query);
    return result.response.text();
  }

  router.post('/imageupload', upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files.map(file => file.path);
      const textChunks = await processFiles(files); 
      const query = textChunks[0].chunks.join('\n')

      const result = await run(query);
      console.log(result);
      res.send({
        result: result,
        success: true
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'An error occurred while processing images.' });
    }
  });

  export default router;