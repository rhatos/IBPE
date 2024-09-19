import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { useState } from "react";

// Component to display the tokenized text output
const TokenizedOutput = () => {
  const location = useLocation(); // Get the location object
  const testData = location.state?.data; // Get the test data from the location state
  const type = location.state?.type; // Get the type of test (e.g., 'text', 'file')
  const testId = location.state?.testId; // Get the test ID

  const statistics = testData?.statistics || {}; // Get the statistics from the test data
  const timeTaken = testData?.tokenization_time || 0; // Get the time taken from the test data
  const tokenizedTextHtml = DOMPurify.sanitize(
    testData?.tokenized_text_html || ""
  ); // Get the tokenized text HTML from the test data and sanitize it

  const [isExporting, setIsExporting] = useState(false); // State to track if the export is in progress

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const handleExport = async () => {
    // Function to handle the export action
    setIsExporting(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/tokenizer-test/download?test_id=${testId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Check if the response is successful
      if (response.ok) {
        const blob = await response.blob(); // Get the response as a blob
        const url = window.URL.createObjectURL(blob); // Create a URL for the blob
        const a = document.createElement("a"); // Create a new anchor element
        a.href = url; // Set the href of the anchor element to the URL
        a.download = "tokenized_output.txt"; // Set the download attribute of the anchor element to the desired file name (user can change the file name)
        document.body.appendChild(a); // Append the anchor element to the body
        a.click(); // Trigger a click event on the anchor element to initiate the download
        window.URL.revokeObjectURL(url); // Revoke the URL to free up memory
      } else {
        console.error("Failed to download file");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-inter font-medium text-white">
          {/* Title*/}
          <span className="text-bpegreen">Tokenization</span> Done
        </h1>
      </div>

      {type === "text" && ( // Check if the type is 'text'
        <div className="flex flex-col items-center">
          <div className="flex p-2">
            <p className="text-white pb-4 font-inter text-md">
              Below is a visual representation of how your text was tokenized.
            </p>
            {/* Display message */}
          </div>

          <div className="flex flex-col items-center space-y-5">
            {/* Render the tokenized text */}
            <div
              className="w-[40rem] h-[19rem] p-2 border-solid border-2 border-bpelightgrey bg-black bg-opacity-50 rounded-md text-slate-300 outline-none font-mono text-sm resize-none"
              dangerouslySetInnerHTML={{ __html: tokenizedTextHtml }} // Render the tokenized text HTML
            />

            <div className="flex flex-row text-white font-inter text-center space-x-10 bg-bpelightgrey w-[50rem] justify-between p-2 rounded-xl drop-shadow-lg">
              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Unique Tokens:</p>
                {/* Display the number of tokens */}
                <p>{statistics.no_tokens || "N/A"}</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Time To Complete:</p>
                {/* Display the time taken */}
                <p>{timeTaken || "N/A"}s</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Token to Word Ratio:</p>
                {/* Display the token to word ratio */}
                <p>{statistics.ratio}</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">% of Vocabulary Used:</p>
                {/* Display the percentage of vocabulary used */}
                <p>{statistics.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "file" && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center space-y-5">
            <div className="flex flex-row text-white font-inter text-center space-x-10 bg-bpelightgrey w-[50rem] justify-between p-2 rounded-xl drop-shadow-lg">
              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Unique Tokens</p>
                {/* Display the number of tokens */}
                <p>{statistics.no_tokens || "N/A"}</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Time To Complete:</p>
                {/* Display the time taken */}
                <p>{timeTaken || "N/A"}s</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">Token to Word Ratio:</p>
                {/* Display the token to word ratio */}
                <p>{statistics.ratio}</p>
              </div>

              <div className="flex items-center flex-col">
                <p className="font-bold text-bpegreen">% of Vocabulary Used:</p>
                {/* Display the percentage of vocabulary used */}
                <p>{statistics.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === "file" && (
        <div className="flex flex-row space-x-5 items-center justify-center">
          <button
            onClick={handleExport} // Handle the export button click event
            className={`w-20 h-8 rounded-md drop-shadow-lg text-black font-inter text-sm ${
              type === "file" ? "bg-bpegreen" : "bg-gray-500"
            }`}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenizedOutput;
