import React from "react";
import TokenizerTitleInput from "./inputs/TokenizerTitleInput";
import CorpusUpload from "./inputs/CorpusUpload";
import TokenizerSubwordInput from "./inputs/TokenizerSubwordInput";
import TrainTokenizer from "./buttons/TrainTokenizer";

const TrainMenu = () => {
  return (
    <div className="flex flex-col space-y-10 items-center justify-center">
      {/* Upload area */}
      <CorpusUpload />
      {/* Title input */}
      <TokenizerTitleInput></TokenizerTitleInput>
      {/* Vocab size input */}
      <TokenizerSubwordInput></TokenizerSubwordInput>
      {/* Train button */}
      <TrainTokenizer />
    </div>
  );
};

export default TrainMenu;
