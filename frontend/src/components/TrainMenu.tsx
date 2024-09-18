import { useEffect, useState } from "react";
import CorpusUpload from "./inputs/CorpusUpload";
import PencilSVG from "../assets/svgs/PencilSVG";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { addToTrainingQueue } from "../slices/trainingSlice";

const TrainMenu = () => {
  const dispatch: AppDispatch = useDispatch();
  const [state, setPageState] = useState(0); // Controls which page of the form is displayed
  const [name, setName] = useState("Model 1"); // Stores the model name
  const [vocabSize, setVocabSize] = useState(""); // Stores the vocabulary size
  const [fileUploaded, setFileUploaded] = useState<string | null>(null); // Stores the uploaded file
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Controls the disabled state of the train button
  const [error, setError] = useState<string | null>(null); // Stores any error messages

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  // Reset the form state to default values
  const resetFormState = () => {
    setName("Model 1");
    setVocabSize("");
    setFileUploaded(null);
    setIsButtonDisabled(true);
    setError(null);
  };

  // Effect to enable/disable the train button based on form input validation
  useEffect(() => {
    if (name.trim() !== "" && vocabSize.trim() !== "" && fileUploaded) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [name, vocabSize, fileUploaded]);

  // Handles the file upload from CorpusUpload component
  const handleFileUpload = (uploaded: string | null) => {
    setFileUploaded(uploaded); // Set the uploaded file name
  };

  // Handles the click event of the Train button
  const handleTrainButtonClick = async () => {
    if (fileUploaded) {
      if (Number(vocabSize) < 100) {
        setError("Vocabulary size must be greater than 100");
        return;
      }
      if (Number(vocabSize) > 100000) {
        setError("Vocabulary size must be less than 100 000");
        return;
      }
      try {
        const requestData = {
          training_file: fileUploaded ? fileUploaded : null, // File for training
          name: name, // Model name
          subword_vocab_count: vocabSize, // Vocabulary size
        };

        const token = localStorage.getItem("token"); // Get the auth token from localStorage

        const response = await fetch(`${apiUrl}/api/tokenizer/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (response.ok) {
          setPageState(1); // Switch to the "training job queued" state
          dispatch(addToTrainingQueue({ name: name, _id: data.tokenizer_id })); // Dispatch to Redux store
          resetFormState(); // Reset the form
        } else {
          setError(data.error || "Failed to train."); // Show error message
          setIsButtonDisabled(true); // Disable the button if there is an error
        }
      } catch (err) {
        console.error("Error uploading file:", err);
        setError("Error uploading file."); // Show generic error message
      }
    }
  };

  // Restrict the vocabulary size input to numeric values only
  const handleVocabSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      // Allow only digits
      setVocabSize(value); // Set the vocabulary size in state
    }
  };

  return (
    <div className="flex flex-col space-y-10 items-center justify-center">
      {state === 0 && ( // Display the form when state is 0
        <div className="flex flex-col space-y-6 items-center justify-center">
          <h1 className="text-4xl font-inter font-medium text-white">
            <span className="text-bpegreen">Train</span> Tokenizer
          </h1>
          <CorpusUpload type="train" onUpload={handleFileUpload} />
          {/* File upload component */}
          {/* Model title input */}
          <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center">
            <div className="flex flex-col space-y-1 max-w-md">
              <label className="text-xs font-medium font-inter text-gray-200">
                Enter model title *
              </label>
              <input
                placeholder={name}
                value={name}
                maxLength={12}
                onChange={(e) => setName(e.target.value)} // Update model name in state
                className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
              />
            </div>
            <PencilSVG /> {/* SVG icon for decoration */}
          </div>
          {/* Vocabulary size input */}
          <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center justify-center">
            <div className="flex flex-col space-y-1 max-w-sm justify-left items-start">
              <label className="text-xs font-medium font-inter text-gray-200">
                Enter vocabulary size *
              </label>
              <div className="flex flex-row items-center justify-center">
                <input
                  type="text"
                  placeholder="40"
                  value={vocabSize}
                  onChange={handleVocabSizeChange} // Handle vocabulary size input
                  className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
                />
              </div>
            </div>
            <PencilSVG /> {/* SVG icon for decoration */}
          </div>
          {/* Train button */}
          <button
            onClick={handleTrainButtonClick}
            disabled={isButtonDisabled} // Disable button if inputs are invalid
          >
            <div
              className={`${
                isButtonDisabled
                  ? "bg-gray-400"
                  : "bg-bpegreen hover:bg-green-500"
              } text-black w-36 text-center h-12 shadow-lg drop-shadow-lg rounded-xl flex p-4 items-center justify-center font-inter`}
            >
              <p className="text-sm">Start training</p>
            </div>
          </button>
          {/* Error message */}
          {error && (
            <div className="mt-4 bg-red-500 text-white p-2 rounded-md">
              {error}
            </div>
          )}
        </div>
      )}

      {/* "Training Job Queued" screen */}
      {state === 1 && (
        <div className="w-4/5 flex flex-col items-center justify-center space-y-12">
          <h1 className="text-4xl font-inter font-medium text-white">
            <span className="text-bpegreen">Training</span> Job Queued
          </h1>
          <p className="text-white text-md font-inter font-light pb-4">
            <span className="text-lg font-bold">
              Your model is being trained!
            </span>
            <br /> <br />
            You can view the training progress via the menu in the bottom right.
          </p>

          {/* Button to train a new model */}
          <button onClick={() => setPageState(0)}>
            <div className="bg-bpegreen hover:bg-green-500 text-black w-36 text-center h-12 shadow-lg drop-shadow-lg rounded-xl flex p-4 items-center justify-center font-inter">
              <p className="text-sm">Train new model</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainMenu;
