import React, { useState } from "react";
import OpenArrow from "../../assets/svgs/OpenArrow";

const SelectTokenizer = ({ isTokenizerSelected, tokenizerIsSelected }) => {
  const [tokenizerDrawerOpen, setTokenizerDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md items-center justify-center">
        <div className="flex flex-col space-y-1 max-w-sm justify-left items-start">
          <label className="text-xs font-medium font-inter text-gray-200">
            Tokenizer to use *
          </label>
          <div className="flex flex-row items-center justify-center">
            {!isTokenizerSelected && (
              <p className="w-80 bg-transparent rounded-sm text-red-500 font-inter text-sm">
                Default Tokenizer
              </p>
            )}
            {isTokenizerSelected && (
              <p className="w-80 bg-transparent rounded-sm text-white font-inter text-sm">
                None selected
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() =>
            tokenizerDrawerOpen
              ? setTokenizerDrawerOpen(false)
              : setTokenizerDrawerOpen(true)
          }
        >
          <OpenArrow />
        </button>
      </div>
    </>
  );
};

export default SelectTokenizer;
