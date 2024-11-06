import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";


// // app/api/hello/route.js
// export async function GET(request: Request) {
//   return new Response(JSON.stringify({ message: 'Hello from Next.js 13 API route!' }), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }




export async function GET (request: Request) {
  const API_KEY = process.env.GEMENI_PUBLIC_API_KEY || "";
  const image = path.join(process.cwd(), 'public', 'img', 'jacket.png');
  const fileManager = new GoogleAIFileManager(API_KEY);
  console.log(request);

  try {
    const uploadResult = await fileManager.uploadFile(
      `${image}`,
      {
        mimeType: "image/jpeg",
        displayName: "Jetpack drawing",
      }
    );

    console.log(`Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      "Tell me the what this clothing is, what color it is, what type of weather it's good for, and rate its comfiness on a scale of 1-10",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    if (result.response.candidates) {
      return new Response(JSON.stringify(result.response.candidates[0].content.parts[0].text), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process the image." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}






export async function POST (request: Request) {
  console.log("post method");
  return new Response(JSON.stringify({ hello: "world" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}


