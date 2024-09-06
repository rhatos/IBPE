import { useEffect, useState } from "react";
import CorpusUpload from "./inputs/CorpusUpload";
import TrainAnotherModel from "./buttons/TrainAnotherModel";
import PencilSVG from "../assets/svgs/PencilSVG";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { addToTrainingQueue } from "../slices/trainingSlice";

const TrainMenu = () => {
  const dispatch: AppDispatch = useDispatch();
  const [state, setPageState] = useState(0);
  const [name, setName] = useState('Model 1');
  const [vocabSize, setVocabSize] = useState('');
  const [fileUploaded, setFileUploaded] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const resetFormState = () => {
    setName('Model 1');
    setVocabSize('');
    setFileUploaded(null)
    setIsButtonDisabled(true);
    setError(null);
  };

  useEffect(() => {
    if (name.trim() !== '' && vocabSize.trim() !== '' && fileUploaded) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [name, vocabSize, fileUploaded]);

  const handleFileUpload = (uploaded: string | null) => {
    setFileUploaded(uploaded);
  };

  const handleTrainButtonClick = async () => {
    if (fileUploaded) {
      try {
        const requestData = {
          training_file: fileUploaded ? fileUploaded : null,
          name: name,
          subword_vocab_count: vocabSize,
        };
        const token = localStorage.getItem('token');
  
        const response = await fetch('http://127.0.0.1:5000/api/tokenizer/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });
  
        const data = await response.json();
        if (response.ok) {
          setPageState(1);
          dispatch(addToTrainingQueue({ name: name, _id: data.tokenizer_id }));
          resetFormState();
        } else {
          setError(data.error || 'Failed to train.');
          setIsButtonDisabled(true)
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        setError('Error uploading file.');
      }
    }
  };

  const handleVocabSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setVocabSize(value);
    }
  };
  

  return (
    <div className="flex flex-col space-y-10 items-center justify-center">
      {state === 0 && (
        <div className="flex flex-col space-y-6 items-center justify-center">
          <h1 className="text-4xl font-inter font-medium text-white">
            <span className="text-bpegreen">Train</span> Tokenizer
          </h1>

          <CorpusUpload type = "train" onUpload={handleFileUpload}/>

          <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center">
            <div className="flex flex-col space-y-1 max-w-md">
              <label className="text-xs font-medium font-inter text-gray-200">
                Enter model title *
              </label>
              <input
                placeholder={name}
                value={name}
                maxLength={12}
                onChange={(e) => setName(e.target.value)}
                className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
              />
            </div>
            <PencilSVG />
          </div>

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
                onChange={handleVocabSizeChange}
                className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
              />
              </div>
            </div>
            <PencilSVG />
          </div>

          <button 
            onClick={handleTrainButtonClick} 
            disabled={isButtonDisabled}
          >
            <div
              className={`${
                            isButtonDisabled ? 'bg-gray-400' : 'bg-bpegreen hover:bg-green-500'
                          } text-black w-36 text-center h-12 shadow-lg drop-shadow-lg rounded-xl flex p-4 items-center justify-center font-inter`}
            >
              <p className="text-sm">Start training</p>
            </div>
          </button>
          {error && (
          <div className="mt-4 bg-red-500 text-white p-2 rounded-md">
            {error}
          </div>
      )}
        </div>
      )}

      {state === 1 && (
        <div className="w-4/5 flex flex-col items-center justify-center space-y-12">
          <h1 className="text-4xl font-inter font-medium text-white">
            <span className="text-bpegreen">Training</span> Job Queued
          </h1>
          <p className="text-white text-md font-inter font-light pb-4">
            <span className="text-lg font-bold">Your model is being trained!</span>
            <br /> <br />
            You can view the training progress via the menu in the bottom right.
          </p>
          <TrainAnotherModel onClick={() => setPageState(0)} />
        </div>
      )}

      {state === 2 && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-inter font-medium text-white">
            <span className="text-bpegreen">Training</span> Complete!
          </h1>
        </div>
      )}
    </div>
  );
};

export default TrainMenu;
