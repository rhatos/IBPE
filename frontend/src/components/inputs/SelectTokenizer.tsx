import React, { useState } from "react";
import OpenArrow from "../../assets/svgs/OpenArrow";
import ModelItemDrawer from "./test_tokenizer_menu_drawer/ModelItemDrawer";

const SelectTokenizer = ({ isTokenizerSelected, tokenizerIsSelected }) => {
  const [tokenizerDrawerOpen, setTokenizerDrawerOpen] = useState(false);

  const [tokenizerName, setTokenizerName] = useState("");

  return (
    <div className="flex flex-col">
      <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md rounded-b-none items-center justify-center">
        <div className="flex flex-col space-y-1 max-w-sm justify-left items-start">
          <label className="text-xs font-medium font-inter text-gray-200">
            Tokenizer to use *
          </label>
          <div className="flex flex-row items-center justify-center">
            {!isTokenizerSelected && (
              <p className="w-80 bg-transparent rounded-sm rounded-b-none text-red-500 font-inter text-sm">
                Default Tokenizer
              </p>
            )}
            {isTokenizerSelected && (
              <p className="w-80 bg-transparent rounded-sm text-white font-inter text-sm">
                {tokenizerName}
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
      {tokenizerDrawerOpen && (
        <div>
          <li
            onClick={() => {
              setTokenizerDrawerOpen(false);
              setTokenizerName("Model 1");
              tokenizerIsSelected(true);
            }}
            className="flex flex-row h-12 border-b-2 border-white border-opacity-20 justify-between items-center bg-bpeblack hover:bg-bpelightgrey"
          >
            <div className="text-white font-inter text-sm pl-2">Model 1</div>
            <div className="text-bpegreen font-inter text-xs pr-2">
              2.2K Vocabulary
            </div>
          </li>
          <li
            onClick={() => {
              setTokenizerDrawerOpen(false);
              setTokenizerName("Default");
              tokenizerIsSelected(false);
            }}
            className="flex flex-row h-12 border-b-2 border-white border-opacity-20 justify-between items-center bg-bpeblack hover:bg-bpelightgrey"
          >
            <div className="text-red-500 font-inter text-sm pl-2">
              Default Tokenizer
            </div>
            <div className="text-bpegreen font-inter text-xs pr-2">
              10K Vocabulary
            </div>
          </li>
        </div>
      )}
    </div>
  );
};

export default SelectTokenizer;
