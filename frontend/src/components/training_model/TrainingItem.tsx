import React from "react";
import ProgressBar from "../bars/ProgressBar";

const TrainingItem = ({ modelName }) => {
  return (
    <div className="justify-center flex flex-col space-y-2 text-white border-b-2 border-opacity-10 border-gray-500 h-fit w-full p-1 pl-2">
      <div className="flex space-x-2 ">
        <p className="text-sm font-inter">{modelName}</p>
        <div className="flex items-center pl-5">
          <ProgressBar></ProgressBar>
        </div>
      </div>
    </div>
  );
};

export default TrainingItem;
