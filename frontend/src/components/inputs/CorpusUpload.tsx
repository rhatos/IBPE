import UploadSVG from "../../assets/svgs/UploadSVG";
import React, { useState } from "react";

interface CorpusUploadProps {
  type: "test" | "train"; // Determines whether the upload is for testing or training data
  onUpload: (file: string | null) => void; // Callback function to handle the uploaded file
}

const CorpusUpload: React.FC<CorpusUploadProps> = ({ type, onUpload }) => {
  const [error, setError] = useState<string | null>(null); // State to track error messages
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null); // State to store uploaded file name

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null; // Get selected file

    if (selectedFile) {
      if (selectedFile.type !== "text/plain") {
        setError("Please upload a .txt file"); // Validation for file type
        onUpload(null); // Trigger callback with null
        setUploadedFileName(null);
      } else {
        setError(null);

        try {
          const formData = new FormData();
          formData.append("file", selectedFile);
          const token = localStorage.getItem("token"); // Get authorization token

          const uploadUrl =
            type === "test"
              ? `${apiUrl}/api/tokenizer-test/upload` // Upload URL for test data
              : `${apiUrl}/api/tokenizer/upload`; // Upload URL for training data

          const response = await fetch(uploadUrl, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`, // Auth header
            },
          });

          const data = await response.json();

          if (response.ok) {
            setUploadedFileName(data.file_name); // Store uploaded file name
            onUpload(data.file_name); // Callback with the uploaded file name
          } else {
            setError(data.error); // Handle errors
            setUploadedFileName(null);
            onUpload(null);
          }
        } catch (err) {
          console.error("Error uploading file:", err); // Error handling
          setError("Error uploading file.");
          setUploadedFileName(null);
          onUpload(null);
        }
      }
    }
  };

  return (
    <div className="bg-bpelightgrey flex flex-col w-[40rem] rounded-md h-[19rem] items-center justify-center p-8">
      <span className="text-white">
        {type === "test" ? "Upload Test Corpus" : "Upload Training Corpus"}
        {/* Display based on 'type' */}
      </span>
      <span className="text-white text-xs pb-4">File must be .txt*</span>
      {/* File format hint */}
      <div className="relative flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg w-full h-full p-4">
        {!uploadedFileName ? ( // Show the upload form or success message
          <>
            <UploadSVG /> {/* Upload icon */}
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer" // Hidden input for file upload
            />
          </>
        ) : (
          <span className="text-white">
            {uploadedFileName} has been uploaded successfully
          </span> // Success message
        )}
      </div>
      {error && (
        <div className="mt-4 bg-red-500 text-white p-2 rounded-md">
          {/* Error message */}
          {error}
        </div>
      )}
    </div>
  );
};

export default CorpusUpload;
