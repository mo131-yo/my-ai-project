// import { NextResponse } from 'next/server';
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const { imageUrl, prompt } = await req.json();

//     const response = await openai.chat.completions.create({
//       model: "gpt-4.1-mini",
//       messages: [
//         {
//           role: "user",
//           content: [
//             { type: "text", text: prompt || "Zurag deer yuu bgaag tailbarla" },
//             {
//               type: "image_url",
//               image_url: {
//                 url: imageUrl,
//               },
//             },
//           ],
//         },
//       ],
//       max_tokens: 400,
//     });

//     const resultText = response.choices[0].message.content;

//     return NextResponse.json({ output: resultText });

//   } catch (error: any) {
//     console.error("zurag unshihad aldaa garlaa:", error);
//     return NextResponse.json(
//       { error: error?.message || "Aldaa garlaa" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Энэ зураг дээр юу байгааг маш товч тайлбарла." },
            {
              type: "image_url",
              image_url: { url: imageUrl }, 
            },
          ],
        },
      ],
    });

    return NextResponse.json({ output: response.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}