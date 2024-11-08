'use server'

import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";

const Gemeni = async () => {
    const API_KEY = process.env.GEMENI_PUBLIC_API_KEY || "";
        const image = path.join(process.cwd(), 'public', 'img', 'jacket.png');
        const fileManager = new GoogleAIFileManager(API_KEY);

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

            console.log(result)
            if (result.response.candidates) { return(result.response.candidates[0].content.parts[0].text) }
            

        } catch (error) {
            console.error("Error:", error);
        }
}
 
export default Gemeni;