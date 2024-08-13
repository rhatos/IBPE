import React from "react";
import TokenizerTitleInput from "./inputs/TokenizerTitleInput";
import CorpusUpload from "./inputs/CorpusUpload";

const TrainMenu = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Upload area */}
      <CorpusUpload />
      {/* Title input */}
      <TokenizerTitleInput></TokenizerTitleInput>
    </div>
  );
};

export default TrainMenu;
