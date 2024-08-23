import React from "react";
import PencilSVG from "../../assets/svgs/PencilSVG";

const TestTitleInput = () => {
  return (
    <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center justify-center">
      <div className="flex flex-col space-y-1 max-w-md justify-left items-start">
        <label className="text-xs font-medium font-inter text-gray-200">
          Enter test title *
        </label>
        <div className="flex flex-row items-center justify-center">
          <input
            placeholder="Test 1"
            className="w-80 bg-transparent rounded-sm text-white placeholder:text-opacity-20 font-inter text-sm focus:ring-opacity-50 focus:ring-1 outline-none"
          />
        </div>
      </div>
      <PencilSVG />
    </div>
  );
};

export default TestTitleInput;
