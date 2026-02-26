import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
       {
          role: "system",
          content: "You are a professional executive chef. Identify ingredients from the image. Categorize them and return only a clean list of ingredients in English."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract ingredients from this image. Format: English only, clean list." },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      temperature: 0.2, // Илүү тогтвортой, "хийсвэрлэхгүй" хариу авахын тулд
    });

    // const ingredientsRaw = visionResponse.choices[0]?.message?.content || "";
const ingredientsRaw = visionResponse.choices[0]?.message?.content || "";

const ingredientsArray = ingredientsRaw
  // 1. Шинэ мөр болон таслалаар салгах
  .split(/\n|,/) 
  .map(item => {
    const cleaned = item
      // 2. Эхний тоо, цэг, од, зураас, тусгай тэмдэгтүүдийг арилгах
      .replace(/^[0-9.)*\-\s•+]+/, '') 
      // 3. Markdown тэмдэглэгээг арилгах
      .replace(/[*_~]/g, '') 
      .trim();

    // 4. Үг бүрийн эхний үсгийг томоор болгох (Optional - гоё харагдуулна)
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  })
  .filter(item => 
    item.length > 1 && 
    item.length < 50 && 
    // 5. Түгээмэл сул үгсийг шүүх (English & Mongolian)
    !/^(ingredients|here|sure|list|extract|орцууд|жагсаалт)/i.test(item)
  );
    
    return NextResponse.json({ ingredients: ingredientsArray });

  } catch (error: any) {
    console.error("Vision Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
