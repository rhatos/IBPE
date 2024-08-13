import React from "react";
import PencilSVG from "../../assets/svgs/PencilSVG";

const TokenizerTitleInput = () => {
  return (
    <>
      <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center justify-center">
        <div className="flex flex-col space-y-1 max-w-sm justify-left items-start">
          <label className="text-xs font-medium font-inter text-gray-200">
            Enter model title
          </label>
          <div className="flex flex-row items-center justify-center">
            <input
              placeholder="Model 1"
              className="w-60 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
            />
          </div>
        </div>
        <PencilSVG />
      </div>
    </>
  );
};

export default TokenizerTitleInput;
