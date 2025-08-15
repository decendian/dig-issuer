import React, { useState } from "react";

export default function FileUpload({ setData }: { setData: (data: string) => void }) {

  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setData(reader.result as string);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
        isDragging ? "border-green-500 bg-green-50" : "border-gray-300 bg-white hover:border-green-500 hover:bg-green-50"
      }`}
    >
      {/* Hidden file input */}
      <input
        id="fileUpload"
        type="file"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            handleFile(file);
          }
        }}
        className="hidden"
      />

      {/* Clickable area */}
      <label htmlFor="fileUpload" className="flex flex-col items-center justify-center w-full h-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-green-500 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
        </svg>
        <span className="text-gray-600 font-medium">
          Click to upload or drag & drop
        </span>
        <span className="text-sm text-gray-400">DID up to 10 MB</span>
      </label>

      {/* File name display */}
      {fileName && (
        <p className="mt-4 text-sm text-gray-700">
          📄 <span className="font-medium">{fileName}</span> selected
        </p>
      )}
    </div>
  );
}
