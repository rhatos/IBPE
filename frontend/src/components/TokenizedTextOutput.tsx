import { useLocation } from "react-router-dom";
import DOMPurify from 'dompurify';
import { useState } from "react";

const TokenizedTextOutput = () => {
  const location = useLocation();
  const testData = location.state?.data;
  const type = location.state?.type;
  const testId = location.state?.testId;
  const statistics = testData?.statistics || {};
  const timeTaken =testData?.tokenization_time || 0;
  const tokenizedTextHtml = DOMPurify.sanitize(testData?.tokenized_text_html || "");
  
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/tokenizer-test/download?test_id=${testId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tokenized_output.txt';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-inter font-medium text-white">
          <span className="text-bpegreen">Tokenization</span> Done
        </h1>
      </div>

      {type === 'text' && (
        <div className="flex flex-col items-center">
          <div className="flex p-2">
            <p className="text-white pb-4 font-inter text-md">
              Below is a visual representation of how your text was tokenized.
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-5">
              {/* Render the tokenized text */}
            <div
              className="w-[40rem] h-[19rem] p-2 border-solid border-2 border-bpelightgrey bg-black bg-opacity-50 rounded-md text-slate-300 outline-none font-mono text-sm resize-none"
              dangerouslySetInnerHTML={{ __html: tokenizedTextHtml }}
            />

            <div className="flex flex-row text-white font-inter text-center space-x-10 bg-bpelightgrey w-[50rem] justify-between p-2 rounded-xl drop-shadow-lg">
              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Tokens</p>
                <p>{statistics.no_tokens || "N/A"}</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Time To Complete</p>
                <p>{timeTaken || "N/A"}s</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Token to Word Ratio</p>
                <p>{statistics.ratio}</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">% of Vocabulary Used</p>
                <p>{statistics.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === 'file' && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center space-y-5">
            <div className="flex flex-row text-white font-inter text-center space-x-10 bg-bpelightgrey w-[50rem] justify-between p-2 rounded-xl drop-shadow-lg">
              
              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Tokens</p>
                <p>{statistics.no_tokens || "N/A"}</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Time To Complete</p>
                <p>{timeTaken || "N/A"}s</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Token to Word Ratio</p>
                <p>{statistics.ratio}</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">% of Vocabulary Used</p>
                <p>{statistics.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === 'file' && (
        <div className="flex flex-row space-x-5 items-center justify-center">
          <button
            onClick={handleExport}
            className={`w-20 h-8 rounded-md drop-shadow-lg text-black font-inter text-sm ${type === 'file' ? 'bg-bpegreen' : 'bg-gray-500'}`}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenizedTextOutput;
