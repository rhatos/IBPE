import React from "react";
import { Link } from "react-router-dom";

const TrainedModelItem = ({ modelName }: { modelName: string }) => {
  return (
    <div className="flex flex-row bg-bpelightgrey justify-between items-center rounded-lg drop-shadow-lg">
      <div className="flex flex-col p-4">
        <h1 className="text-white font-inter text-xl">{modelName}</h1>
        <div className="flex flex-row space-x-2 items-center">
          <p className="text-white font-inter text-sm">Vocabulary Size:</p>
          <span className="text-bpegreen font-inter text-sm"> 2.2k</span>
          <span className="text-white font-inter text-xs">(Tokens)</span>
        </div>
      </div>
      <div className="flex flex-col text-black items-center justify-center p-4 space-y-2 ">
        <Link to="/user/model/tokenize">
          <div className="flex items-center w-20 drop-shadow-lg bg-bpegreen text-sm rounded-md h-8 font-inter justify-center hover:bg-green-500">
            Test
          </div>
        </Link>
        <div className="flex items-center w-20 bg-gray-300 h-8 drop-shadow-lg text-sm rounded-md font-inter justify-center hover:bg-gray-400">
          Delete
        </div>
      </div>
    </div>
  );
};

export default TrainedModelItem;
