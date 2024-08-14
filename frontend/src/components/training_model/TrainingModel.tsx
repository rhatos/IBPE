import React from "react";
import OpenArrow from "../../assets/svgs/OpenArrow";
import TrainingItem from "./TrainingItem";

const TrainingModel = () => {
  return (
    <div className="w-80 h-36 border-black rounded-lg m-8 drop-shadow-lg shadow-md flex">
      <div className="flex-col w-full">
        <div className="flex rounded-md rounded-b-none bg-bpelightgrey justify-between items-center">
          <p className="text-white font-inter pl-2 p-1 text-md">
            Training Queue
          </p>
          <span className="pr-2">
            <OpenArrow />
          </span>
        </div>
        <div className="flex overflow-auto flex-col space-y-1 bg-bpeblack h-28">
          <TrainingItem modelName={"Model1"} />
        </div>
      </div>
    </div>
  );
};

export default TrainingModel;
