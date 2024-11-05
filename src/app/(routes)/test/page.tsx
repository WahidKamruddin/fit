"use client";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

const Test = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);

  const handleChange = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      console.log("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("fileData", file);
    formData.append("mimeType", file.type);
    formData.append("displayName", file.name);

    const res = await fetch("/api/gemeni", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setResponse(data.response);
    } else {
      console.log("Error from API:");
    }
  };

  return (
    <div>
      <div className="p-20">
        <FileUploader
            multiple={false}
            handleChange={(e: any) => setFile(e)}
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
      {response ? <p>Response: {response}</p> : null}
    </div>
  );
};

export default Test;
