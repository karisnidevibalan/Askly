import React, { useState } from "react";

export default function UploadPanel({ onUpload, mode }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");
    if (!onUpload || typeof onUpload !== "function") {
      console.error("Upload callback not provided!");
      return;
    }

    setUploading(true);
    try {
      await onUpload(file, mode);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Upload Study Material</h2>
      <input
        type="file"
        accept=".pdf,.txt"
        onChange={handleFileChange}
        className="border p-1 rounded w-full mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`w-full py-2 px-4 rounded ${
          uploading ? "bg-gray-400" : "bg-purple-500 hover:bg-purple-600"
        } text-white font-semibold`}
      >
        {uploading ? "Uploading..." : "Upload & Summarize"}
      </button>
      {file && !uploading && (
        <p className="text-sm mt-2 text-gray-600">Selected: {file.name}</p>
      )}
    </div>
  );
}
