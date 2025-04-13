"use client";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import Gemeni from "@/src/app/api/gemeniapi";


const fileTypes = ["JPG", "PNG", "GIF"];

const Test = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState('');


  const handleUpload = async () => {
    const someResponse = await Gemeni();   
    setResponse(someResponse || '');
  }

  //   if (!file) {
  //     console.log("No file selected.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("fileData", file);

  //   // Debugging FormData
  //   console.log(formData.get("fileData"));

  //   try {
  //     const res = await fetch("/api/gemeni", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       const errorText = await res.text();  // Capture error message
  //       console.log("Error from API:", res.status, errorText);
  //       return;
  //     }

  //     // Process the response as a Blob (image or file)
  //     const blob = await res.blob();
  //     const url = URL.createObjectURL(blob);

  //     // Create a link to download the returned file
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = file.name; // Use the original file name or set a custom one
  //     link.click();
  //     URL.revokeObjectURL(url);

  //     console.log("File downloaded successfully.");
  //   } catch (error) {
  //     console.error("File upload failed:", error);
  //   }
  // };

  return (
    <div>
      <div className="p-20">
        <FileUploader
          multiple={false}
          handleChange={(file: File) => setFile(file)}
          types={fileTypes}
          name="file"
          label="Upload or Drop a File"
          required
        />
      </div>
      <button
        className="ml-20 p-20 text-white bg-black rounded-xl"
        onClick={handleUpload}
      >
        Upload and Process
      </button>
      {response ? <p>{response}</p> : null}
    </div>
  );
};

export default Test;
