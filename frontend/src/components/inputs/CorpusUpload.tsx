import UploadSVG from "../../assets/svgs/UploadSVG";
import React, { useState } from 'react';

interface CorpusUploadProps {
  type: "test" | "train"; // Variable to determine the upload type
}

const CorpusUpload: React.FC<CorpusUploadProps> = ({ type }) =>{
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      if (selectedFile.type !== 'text/plain') {
        setError('Please upload a .txt file');
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
        console.log("Selected file:", selectedFile.name);
        // Add functionality to handle the file upload
      }
    }
  };

    return (
    <div className="bg-bpelightgrey flex flex-col w-[40rem] rounded-md h-[19rem] items-center justify-center p-8">
      <span className="text-white ">
        {type === "test" ? "Upload Test Corpus" : "Upload Training Corpus"}
      </span>
      <span className="text-white text-xs pb-4">File must be .txt*</span>

      <div className="relative flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg w-full h-full p-4">
        <UploadSVG />
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      {error && (
        <div className="mt-4 bg-red-500 text-white p-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};


export default CorpusUpload;
