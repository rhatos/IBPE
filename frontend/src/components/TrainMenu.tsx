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
  // Page state
  const [state, setPageState] = useState(0);
  const [name, setName] = useState('Model 1');

  const changeState = (trainingState: number) => {
    setPageState(trainingState);
    if (trainingState == 1){
      dispatch(addToTrainingQueue({name}))
    }
  };

  return (
    <div className="flex flex-col space-y-10 items-center justify-center">
      {state === 0 && (
        <>
          <h1 className="text-4xl font-inter font-medium text-white">
            {/* Page Title */}
            <span className="text-bpegreen">Train</span> Tokenizer
          </h1>

          <CorpusUpload />

          {/* <TokenizerTitleInput /> */}

        <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center justify-center">
            <div className="flex flex-col space-y-1 max-w-md justify-left items-start">
              <label className="text-xs font-medium font-inter text-gray-200">
                Enter model title *
              </label>
              <div className="flex flex-row items-center justify-center">
                <input
                  placeholder= {name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
                />
              </div>
          </div>
          <PencilSVG />
        </div>

          <TokenizerSubwordInput />

          <TrainTokenizer onClick={() => changeState(1)} />
        </>
      )}

      {state === 1 && (
        <div className="w-4/5 flex flex-col items-center justify-center space-y-12">
          <h1 className="text-4xl font-inter font-medium text-white">
            {/* Page Title */}
            <span className="text-bpegreen">Training</span> Job Queued
          </h1>
          <p className="text-white text-md font-inter font-light pb-4">
            <span className="text-lg font-bold">
              Your model is being trained!
            </span>
            <br /> <br /> You can view the training progress via the menu in the
            bottom right.
          </p>
          <TrainAnotherModel onClick={() => changeState(0)} />
          {/* <ProgressBar changePageState={() => changeState(2)} /> */}
        </div>
      )}

      {state === 2 && (
        <div>
          <h1 className="text-4xl font-inter font-medium text-white">
            {/* Page Title */}
            <span className="text-bpegreen">Training</span> complete!
          </h1>
        </div>
      )}
    </div>
  );
};

export default TrainMenu;
