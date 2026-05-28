import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
// import { Metadata } from "pdf-parse";




export async function indexTheDocument(filepath){
    const loader = new PDFLoader(filepath, {splitPages: false})
    const doc = await loader.load();
    // console.log(doc[0].pageContent)

    const splitter = new RecursiveCharacterTextSplitter(
    { 
      chunkSize: 500,
      chunkOverlap: 100 
    })
        const texts = await splitter.splitText(doc[0].pageContent)
        // console.log(texts.length)

        const documents = texts.map((chunk)=>{
            return{
                pageContent: chunk,
            metadata: doc[0].metadata
            }
                    })
        // console.log(documents)
    


    const embeddings = new OpenAIEmbeddings({
     model: "text-embedding-3-small",
    //  dimensions= by default 1536 or 512
    });

    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY
    });

    const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX_NAME)

    export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
    });

    await vectorStore.addDocuments(documents);



}


