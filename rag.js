// Implementation Plan
// Stage1: Indexing
// 1. Load the document (pdf,text)
// 2. Chunk the document
// 3. Generate Vector Embeddings
// 4. Store the vector embedings in vector database
// Stage2: Using the chatbot
// 1. Setup LLM 
// 2.Add Retreival Steps 
// 3. Pass Input + relevant information to LLM 
// 4. Congratsssssssssssssss

import dotenv from "dotenv";
dotenv.config()
import { indexTheDocument } from "./prepare.js";

const filepath = './document.pdf';
indexTheDocument(filepath)

