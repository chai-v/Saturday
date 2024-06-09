//Handle file uploades and create embeddings for each file in pine cone
//Update the mongodb cluster based on the user id and add the embeddings indices to the object
import express, { Request, Response, Router } from 'express';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";


