import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { json } from "stream/consumers";


// // app/api/hello/route.js
// export async function GET(request: Request) {
//   return new Response(JSON.stringify({ message: 'Hello from Next.js 13 API route!' }), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }



export default async function GET (request: Request) {
  const API_KEY = process.env.GEMENI_PUBLIC_API_KEY || "";
  const image = path.join(process.cwd(), 'public', 'img', 'jacket.png');
  const fileManager = new GoogleAIFileManager(API_KEY);
  console.log(request);

  const uploadResult = await fileManager.uploadFile(
    `${image}`,
    {
      mimeType: "image/jpeg",
      displayName: "Jetpack drawing",
    },
  );

  // View the response.
  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
  );

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    "Tell me about this image.",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);

  return new Response(JSON.stringify(result.response.text())), {
    status: 200
  };
}
 

