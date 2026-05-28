import readline from "node:readline/promises"
import Groq from "groq-sdk"
import { stdin } from "node:process"
import {vectorStore} from './prepare.js'
import { context } from "langchain"

const groq = new Groq({apiKey: process.env.GROQ_API_KEY})


export function chat() {
    const r1 = readline.createInterface({input:stdin, output:stdout})
    while(true){
        const question = await r1.question('You: ');
        if(question === '/bye'){
            break;
        }
        //  retreival step 
        const releventChunks = await vectorStore.similaritySearch(question, 3);

        const context = releventChunks.map((chunks)=> chunks.pageContent.join('/n/n'))
    }

    const SYSTEM_PROMPT = `You are a customer support for answering tasks. Use the following relevant pieces of retreived context to answer the question, if you dont know the answer say I dont Know.`
    const userQuery = `Question: ${question}
    Relevent Context: ${context}
    Answer Now`
    const completion = await groq.chat.completions.create({
        messages:[
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            {
                role: 'user',
                content:     userQuery
            }
        ],
          model: "llama-3.3-70b-versatile",
    })

    console.log(`Assistant: ${completion.choices[0].message.content}`)
    r1.close()
}