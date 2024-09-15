import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CorpusUpload from "./inputs/CorpusUpload";
import SelectTokenizer from "./inputs/SelectTokenizer";
import TestCorpusTextArea from "./inputs/TestCorpusTextArea";
import PencilSVG from "../assets/svgs/PencilSVG";

const TokenizeMenu = () => {

  const location = useLocation();
  const modelsPageModelId = location.state?.modelId;
  const modelsPageName = location.state?.name;
  const [isFileOptionSelected, setFileOptionSelected] = useState(false);
  const [isTokenizerSelected, setTokenizerSelected] = useState(false);
  const [testTitle, setTestTitle] = useState('Test 1');
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [selectedTokenizer, setSelectedTokenizer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setPolling] = useState(false);
  const navigate = useNavigate();

  const resetFormState = () => {
    setFileOptionSelected(false);
    setTokenizerSelected(false);
    setSelectedTokenizer('');
    setTestTitle('Test 1');
    setFileUploaded(null);
    setTextInput("");
    setIsButtonDisabled(true);
    setError(null);
  };

  useEffect(() => {
    if (
      testTitle.trim() !== "" &&
      (isFileOptionSelected ? fileUploaded : textInput) &&
      isTokenizerSelected
    ) {
      setIsButtonDisabled(false);
    } else {
      console.log(testTitle, fileUploaded, textInput, isFileOptionSelected, isTokenizerSelected);
      setIsButtonDisabled(true);
    }
  }, [testTitle, fileUploaded, textInput, isFileOptionSelected, isTokenizerSelected]);

  const handleFileUpload = (uploaded: string | null) => {
    setFileUploaded(uploaded);
  };

  const handleTokenizerSelection = (selected: boolean, tokenizer_id: string | null) => {
    setTokenizerSelected(selected);
    setSelectedTokenizer(tokenizer_id);
  };

  const handleTestButtonClick = async () => {
    if (fileUploaded || !isFileOptionSelected) {
      try {
        let requestData;
        if (isFileOptionSelected) {
           requestData = {
            tokenizer_id: selectedTokenizer,
            test_name: testTitle,
            input_file: fileUploaded,
          }
        } else {
           requestData = {
            tokenizer_id: selectedTokenizer,
            test_name: testTitle,
            input_text: textInput,
          }
        }

        const token = localStorage.getItem('token');

        const response = await fetch('http://127.0.0.1:5000/api/tokenizer-test/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Test created successfully:', data);
          setIsLoading(true);
          setPolling(true);
          startPolling(data.test_id);
        } else {
          setError(data.error || 'Failed to test.');
          setIsButtonDisabled(true);
        }
      } catch (err) {
        console.error('Error during testing:', err);
        setError('Error during testing.');
      }
    }
  };

  const startPolling = (testId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/tokenizer-test/status?test_id=${testId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.tokenized) {
          clearInterval(intervalId);
          resetFormState();
          const type = isFileOptionSelected ? 'file' : 'text';
          navigate("/user/tests/tokenized", { state: { data: data, type: type, testId: testId } });
        }
      } catch (error) {
        console.error("Error during polling:", error);
      }
    }, 400);
  };

  if (isLoading) {
    return (
      <>
      <style>
      {`
        .loader {
          border: 8px solid #f3f3f3; /* Light grey */
          border-top: 8px solid #4CAF50; /* Green */
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-3xl font-medium text-white">Your model is being tested and tokenized</h2>
        <p className="text-md font-light text-gray-300 mt-4">This could take up to 15 seconds</p>
        <div className="mt-10">
          <div className="loader"></div>
        </div>
      </div>
      
      </>
    );
  }

  return (
    <div className="flex-col space-y-10">
      <div className="flex flex-col space-y-10 items-center justify-center">
        <h1 className="text-4xl font-inter font-medium text-white">
          <span className="text-bpegreen">Test</span> Model
        </h1>
        <p className="text-white text-center text-md font-inter font-light w-[30rem]">
          You can test your trained model with a manually typed text input or you can upload a test corpus file.
        </p>

        {isFileOptionSelected ? (
          <CorpusUpload type="test" onUpload={handleFileUpload} />
        ) : (
          <TestCorpusTextArea text={textInput} setText={setTextInput} />
        )}

        <div className="flex space-x-4 items-center justify-center">
          <button
            className={`w-20 h-8 rounded-md drop-shadow-lg text-sm font-inter ${
              !isFileOptionSelected ? 'bg-bpegreen text-black' : 'bg-bpelightgrey text-white hover:bg-zinc-900'
            }`}
            onClick={() => setFileOptionSelected(false)}
          >
            Text
          </button>
          <button
            className={`w-20 h-8 rounded-md drop-shadow-lg text-sm font-inter ${
              isFileOptionSelected ? 'bg-bpegreen text-black' : 'bg-bpelightgrey text-white hover:bg-zinc-900'
            }`}
            onClick={() => setFileOptionSelected(true)}
          >
            File
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-10 items-center justify-center">
        <SelectTokenizer isTokenizerSelected={isTokenizerSelected} tokenizerIsSelected={handleTokenizerSelection} modelsPageModelId={modelsPageModelId} modelsPageName={modelsPageName} />
      </div>
      
      <div className="flex flex-col space-y-10 items-center justify-center">
        <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center justify-center">
          <div className="flex flex-col space-y-1 max-w-md justify-left items-start">
            <label className="text-xs font-medium font-inter text-gray-200">
              Enter test title *
            </label>
            <input
              placeholder={testTitle}
              value={testTitle}
              maxLength={12}
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
            />
          </div>
          <PencilSVG />
        </div>
      </div>

      <div className="flex justify-center items-center pb-8">
          <button
            onClick={handleTestButtonClick}
            disabled={isButtonDisabled}>
            <div
              className={`${
                isButtonDisabled ? 'bg-gray-400' : 'bg-bpegreen hover:bg-green-500'
              } text-black w-36 text-center h-12 shadow-lg drop-shadow-lg rounded-xl flex p-4 items-center justify-center font-inter`}
            >
              <p className="text-sm">Tokenize text</p>
            </div>
          </button>
        {error && (
          <div className="mt-4 bg-red-500 text-white p-2 rounded-md">
            {error}
          </div>
      )}
      </div>
    </div>
  );
};

export default TokenizeMenu;
