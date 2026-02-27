// import { NextResponse } from 'next/server';
// import OpenAI from "openai";

// const openai = new OpenAI({
//     apiKey: process.env.API_KEY,
// });

// export async function POST(req: Request) {
//     try {
//         const { prompt } = await req.json();

//         const response = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [
//                 { role: "system", content: "Mini Chatgpt." },
//                 { role: "user", content: prompt }   
//             ],
//         });

//         const text = response.choices[0].message.content;
//         return NextResponse.json({ output: text });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Aldaa garlaa" }, { status: 500 });
//     }
// }


import { NextResponse } from 'next/server';
import OpenAI from "openai";


const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { error: "Prompt hooson esvel buruu bn" }, 
                { status: 400 }
            );
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: "Chi bol tuslah mini chatgpt. Hariultiig tovch buguud todorhoi ugnu" 
                },
                { role: "user", content: prompt }   
            ],
            temperature: 0.7,
        });

        const text = response.choices[0]?.message?.content;

        if (!text) {
            throw new Error("Ai-aas hariu irsengui");
        }

        return NextResponse.json({ output: text });

    } catch (error: any) {
        console.error("OpenAI API Error:", error);

        const errorMessage = error.response?.data?.error?.message || "Ai systemtei holbohod aldaa garlaa";
        return NextResponse.json(
            { error: errorMessage }, 
            { status: 500 }
        );
    }
}