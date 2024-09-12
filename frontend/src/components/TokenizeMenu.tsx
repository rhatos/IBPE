import { useState, useEffect } from "react";
import CorpusUpload from "./inputs/CorpusUpload";
import SelectTokenizer from "./inputs/SelectTokenizer";
import TestCorpusTextArea from "./inputs/TestCorpusTextArea";
import { Link } from "react-router-dom";
import PencilSVG from "../assets/svgs/PencilSVG";

const TokenizeMenu = () => {
  const [isFileOptionSelected, setFileOptionSelected] = useState(false);
  const [isTokenizerSelected, setTokenizerSelected] = useState(false);
  const [testTitle, setTestTitle] = useState('Test 1');
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [selectedTokenizer, setSelectedTokenizer] = useState<string | null>(null);

  const resetFormState = () => {
    setFileOptionSelected(false);
    setTokenizerSelected(false);
    setSelectedTokenizer('');
    setTestTitle('Test 1');
    setFileUploaded(null)
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
        }else {
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
          resetFormState();
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
        <SelectTokenizer isTokenizerSelected={isTokenizerSelected} tokenizerIsSelected={handleTokenizerSelection} />
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
        {/* <Link to="/user/tests/tokenized"> */}
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
        {/* </Link> */}
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
