import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CorpusUpload from "./inputs/CorpusUpload";
import SelectTokenizer from "./inputs/SelectTokenizer";
import TestCorpusTextArea from "./inputs/TestCorpusTextArea";
import PencilSVG from "../assets/svgs/PencilSVG";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const TokenizeMenu = () => {
  const location = useLocation(); // Hook to access current route info, like state passed from previous route
  const modelsPageModelId = location.state?.modelId; // Extracting model ID from previous route's state
  const modelsPageName = location.state?.name; // Extracting model name from previous route's state

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn); // Check if the user is logged in

  const [isFileOptionSelected, setFileOptionSelected] = useState(false); // State to track if file upload option is selected
  const [isTokenizerSelected, setTokenizerSelected] = useState(false); // State to track if tokenizer is selected
  const [testTitle, setTestTitle] = useState("Test 1"); // State to track the test title
  const [fileUploaded, setFileUploaded] = useState<string | null>(null); // State to track uploaded file
  const [textInput, setTextInput] = useState<string>(""); // State to track the manually typed text
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // State to control "Tokenize" button disable/enable
  const [error, setError] = useState<string | null>(null); // State to hold any error messages
  const [selectedTokenizer, setSelectedTokenizer] = useState<string | null>(
    null
  ); // State to track selected tokenizer ID
  const [isLoading, setIsLoading] = useState(false); // State to track if loading animation should be shown
  const navigate = useNavigate();

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  // Function to reset all form-related states
  const resetFormState = () => {
    setFileOptionSelected(false);
    setTokenizerSelected(false);
    setSelectedTokenizer("");
    setTestTitle("Test 1");
    setFileUploaded(null);
    setTextInput("");
    setIsButtonDisabled(true);
    setError(null);
  };

  // useEffect to enable/disable the "Tokenize" button based on form state
  useEffect(() => {
    if (
      testTitle.trim() !== "" && // Check if test title is not empty
      (isFileOptionSelected ? fileUploaded : textInput) && // Check if file or text input is provided
      isTokenizerSelected // Check if a tokenizer is selected
    ) {
      setIsButtonDisabled(false); // Enable button if all conditions are met
    } else {
      console.log(
        testTitle,
        fileUploaded,
        textInput,
        isFileOptionSelected,
        isTokenizerSelected
      );
      setIsButtonDisabled(true); // Disable button otherwise
    }
  }, [
    testTitle,
    fileUploaded,
    textInput,
    isFileOptionSelected,
    isTokenizerSelected,
  ]);

  // Handle file upload and update state
  const handleFileUpload = (uploaded: string | null) => {
    setFileUploaded(uploaded);
  };

  // Handle tokenizer selection
  const handleTokenizerSelection = (
    selected: boolean,
    tokenizer_id: string | null
  ) => {
    setTokenizerSelected(selected);
    setSelectedTokenizer(tokenizer_id);
  };

  // Function triggered on clicking the "Tokenize text" button
  const handleTestButtonClick = async () => {
    if (fileUploaded || !isFileOptionSelected) {
      // Ensure file is uploaded if file option is selected
      try {
        let requestData; // Data payload to send to the backend
        if (isFileOptionSelected) {
          // If file is selected, include file in request
          requestData = {
            tokenizer_id: selectedTokenizer,
            test_name: testTitle,
            input_file: fileUploaded,
          };
        } else {
          // If text input is selected, include text in request
          requestData = {
            tokenizer_id: selectedTokenizer,
            test_name: testTitle,
            input_text: textInput,
          };
        }

        let response;

        if (loggedIn) {
          const token = localStorage.getItem("token"); // Retrieve authentication token from localStorage
          // Send the request to the backend to create a tokenizer test
          response = await fetch(`${apiUrl}/api/tokenizer-test/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
          });
        } else {
          // Send the request to the backend to create a tokenizer test
          response = await fetch(`${apiUrl}/api/tokenizer-test/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });
        }
        const data = await response.json(); // Parse JSON response
        if (response.ok) {
          // If request is successful
          console.log("Test created successfully:", data);
          setIsLoading(true); // Show loading spinner
          startPolling(data.test_id); // Begin polling for test status using test ID
        } else {
          // If request fails, display error
          setError(data.error || "Failed to test.");
          setIsButtonDisabled(true);
        }
      } catch (err) {
        // Catch any errors during the request
        console.error("Error during testing:", err);
        setError("Error during testing.");
      }
    }
  };

  // Function to start polling the backend for tokenizer test status
  const startPolling = (testId: string) => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/tokenizer-test/status?test_id=${testId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data.tokenized) {
          // If test is complete (tokenized)
          clearInterval(intervalId); // Stop polling
          resetFormState(); // Reset form state
          const type = isFileOptionSelected ? "file" : "text"; // Determine test type (file or text)
          navigate("/user/tests/tokenized", {
            state: { data: data, type: type, testId: testId },
          }); // Navigate to tokenized result page
        }
      } catch (error) {
        console.error("Error during polling:", error);
      }
    }, 400); // Poll every 400ms
  };

  // If loading is true, display the loading spinner UI
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
          animation: spin 1s linear infinite; /* Spinner animation */
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
        </style>
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-3xl font-medium text-white">
            Your model is being tested and tokenized
          </h2>
          <p className="text-md font-light text-gray-300 mt-4">
            This could take up to 60 seconds...
          </p>
          <div className="mt-10">
            <div className="loader"></div> {/* Loading spinner */}
          </div>
        </div>
      </>
    );
  }

  // Main UI for the TokenizeMenu component
  return (
    <div className="flex-col space-y-6 ">
      <div className="flex flex-col space-y-8 items-center justify-center">
        <h1 className="text-4xl font-inter font-medium text-white">
          <span className="text-bpegreen">Test</span> Model
        </h1>
        <p className="text-white text-center text-md font-inter font-light w-[30rem]">
          You can test your trained model with a manually typed text input or
          you can upload a test corpus file.
        </p>
        {!loggedIn ? (
          <p className="text-white text-center text-md font-inter font-light w-[30rem]">
            (must be logged in to upload a file)
          </p>
        ) : (
          <></>
        )}

        {/* Toggle between file upload and text input */}
        {isFileOptionSelected && loggedIn ? (
          <CorpusUpload type="test" onUpload={handleFileUpload} /> // File upload component
        ) : (
          <TestCorpusTextArea text={textInput} setText={setTextInput} /> // Text input component
        )}

        <div className="flex space-x-4 items-center justify-center">
          <button
            className={`w-20 h-8 rounded-md drop-shadow-lg text-sm font-inter ${
              !isFileOptionSelected
                ? "bg-bpegreen text-black"
                : "bg-bpelightgrey text-white hover:bg-zinc-900"
            }`}
            onClick={() => setFileOptionSelected(false)} // Toggle to text input
          >
            Text
          </button>
          <button
            className={`w-20 h-8 rounded-md drop-shadow-lg text-sm font-inter ${
              isFileOptionSelected
                ? "bg-bpegreen text-black"
                : "bg-bpelightgrey text-white hover:bg-zinc-900"
            }`}
            onClick={() => setFileOptionSelected(true)} // Toggle to file upload
            disabled={!loggedIn}
          >
            File
          </button>
        </div>
      </div>

      <div className="flex flex-col space-y-10 items-center justify-center">
        {/* Tokenizer selection component */}
        <SelectTokenizer
          isTokenizerSelected={isTokenizerSelected}
          tokenizerIsSelected={handleTokenizerSelection}
          modelsPageModelId={modelsPageModelId}
          modelsPageName={modelsPageName}
        />
      </div>

      <div className="flex flex-col space-y-10 items-center justify-center">
        {/* Test title input */}
        <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center justify-center">
          <div className="flex flex-col space-y-1 max-w-md justify-left items-start">
            <label className="text-xs font-medium font-inter text-gray-200">
              Enter test title
            </label>
            <input
              placeholder={testTitle}
              value={testTitle}
              maxLength={12} // Limit title length to 12 characters
              onChange={(e) => setTestTitle(e.target.value)}
              className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
            />
          </div>
          <PencilSVG /> {/* Icon next to the input */}
        </div>
      </div>

      <div className="flex justify-center items-center pb-2">
        {/* Button to trigger test, disabled when the form is incomplete */}
        <button onClick={handleTestButtonClick} disabled={isButtonDisabled}>
          <div
            className={`${
              isButtonDisabled
                ? "bg-gray-400"
                : "bg-bpegreen hover:bg-green-500"
            } text-black w-36 text-center h-12 shadow-lg drop-shadow-lg rounded-xl flex p-4 items-center justify-center font-inter`}
          >
            <p className="text-sm">Tokenize text</p>
          </div>
        </button>
      </div>
      <div className="flex justify-center items-center pb-2">
        {/* Error message display */}
        {error && (
          <div className="bg-red-500 text-white p-2 rounded-md w-[12rem]">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenizeMenu;
