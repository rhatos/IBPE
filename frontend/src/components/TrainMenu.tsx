import React, { useState } from "react";
import TokenizerTitleInput from "./inputs/TokenizerTitleInput";
import CorpusUpload from "./inputs/CorpusUpload";
import TokenizerSubwordInput from "./inputs/TokenizerSubwordInput";
import TrainTokenizer from "./buttons/TrainTokenizer";
import ProgressBar from "./bars/ProgressBar";

// Needs 3 states:
// Default -> normal upload file and set parameters
// Training -> Displays training progress
// Trained -> Displays statistics and subword vocab

const TrainMenu = () => {
  // Page state
  const [state, setPageState] = useState(0);

  const changeState = (trainingState: number) => {
    setPageState(trainingState);
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

          <TokenizerTitleInput />

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
