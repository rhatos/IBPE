import { useState } from "react";
import CorpusUpload from "./inputs/CorpusUpload";
import TokenizerSubwordInput from "./inputs/TokenizerSubwordInput";
import TrainTokenizer from "./buttons/TrainTokenizer";
import TrainAnotherModel from "./buttons/TrainAnotherModel";
import PencilSVG from "../assets/svgs/PencilSVG";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { addToTrainingQueue } from "../slices/trainingSlice";

// Needs 2 states:
// Default -> normal upload file and set parameters
// Train job submitted -> indicate to user that job is on the queue

const TrainMenu = () => {
  const dispatch: AppDispatch = useDispatch();
  const [state, setPageState] = useState(0);
  const [name, setName] = useState('Model 1');

  const handleTrainButtonClick = () => {
    dispatch(addToTrainingQueue({ name }));
    setPageState(1);
  };

  return (
    <div className="flex flex-col space-y-10 items-center justify-center">
      {state === 0 && (
        <div className="flex flex-col space-y-10 items-center justify-center">
          <h1 className="text-4xl font-inter font-medium text-white">
            <span className="text-bpegreen">Train</span> Tokenizer
          </h1>

          <CorpusUpload type = "train"/>

          <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center">
            <div className="flex flex-col space-y-1 max-w-md">
              <label className="text-xs font-medium font-inter text-gray-200">
                Enter model title *
              </label>
              <input
                placeholder={name}
                value={name}
                maxLength={8}
                onChange={(e) => setName(e.target.value)}
                className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
              />
            </div>
            <PencilSVG />
          </div>

          <TokenizerSubwordInput />
          <TrainTokenizer onClick={handleTrainButtonClick} />
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
