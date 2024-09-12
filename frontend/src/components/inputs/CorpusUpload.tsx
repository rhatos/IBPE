import UploadSVG from "../../assets/svgs/UploadSVG";
import React, { useState } from 'react';

interface CorpusUploadProps {
  type: "test" | "train";
  onUpload: (file: string | null) => void;
}

const CorpusUpload: React.FC<CorpusUploadProps> = ({ type, onUpload }) =>{
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      if (selectedFile.type !== 'text/plain') {
        setError('Please upload a .txt file');
        setFile(null);
        onUpload(null);
        setUploadedFileName(null);
      } else {
        setError(null);
        setFile(selectedFile);

        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          const token = localStorage.getItem('token');
          if (type == "test") {
            const response = await fetch('http://127.0.0.1:5000/api/tokenizer-test/upload', {
              method: 'POST',
              body: formData,
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const data = await response.json();
            if (response.ok) {
              console.log(data.file_name)
              setUploadedFileName(data.file_name);
              onUpload(data.file_name)
            } else {
              setError(data.error);
              setUploadedFileName(null);
              onUpload(null)
            }
          } else {
          const response = await fetch('http://127.0.0.1:5000/api/tokenizer/upload', {
            method: 'POST',
            body: formData,
            headers: {
                      'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (response.ok) {
            console.log(data.file_name)
            setUploadedFileName(data.file_name);
            onUpload(data.file_name)
          } else {
            setError(data.error);
            setUploadedFileName(null);
            onUpload(null)
          }
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        setError('Error uploading file.');
        setUploadedFileName(null);
        onUpload(null)
      }
    }
  }
}
  return (
    <div className="bg-bpelightgrey flex flex-col w-[40rem] rounded-md h-[19rem] items-center justify-center p-8">
      <span className="text-white">
        {type === "test" ? "Upload Test Corpus" : "Upload Training Corpus"}
      </span>
      <span className="text-white text-xs pb-4">File must be .txt*</span>

      <div className="relative flex flex-col items-center justify-center border-dashed border-2 border-gray-300 rounded-lg w-full h-full p-4">
        {!uploadedFileName ? (
          <>
            <UploadSVG />
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </>
        ) : (
          <span className="text-white">{uploadedFileName} has been uploaded successfully</span>
        )}
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
