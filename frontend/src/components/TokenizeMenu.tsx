import React, { useState } from "react";
import TestCorpusUpload from "./inputs/TestCorpusUpload";
import SelectTokenizer from "./inputs/SelectTokenizer";
import TestCorpusTextArea from "./inputs/TestCorpusTextArea";
import PencilSVG from "../assets/svgs/PencilSVG";
import TestTitleInput from "./inputs/TestTitleInput";
import { Link } from "react-router-dom";

const TokenizeMenu = () => {
  const [tokenizerSelected, setTokenizerSelected] = useState(false);
  const [fileOptionSelected, setFileOptionSelected] = useState(false);

  return (
    <div className="flex-col space-y-10">
      <div className="flex flex-col space-y-10 items-center justify-center">
        <h1 className="text-4xl font-inter font-medium text-white">
          {/* Page Title */}
          <span className="text-bpegreen">Test</span> Model
        </h1>
        <p className="text-white text-center text-md font-inter font-light w-[30rem] ">
          You can test your trained model with a manually typed text input or
          you can upload a test corpus file.
        </p>
        {fileOptionSelected && <TestCorpusUpload />}
        {!fileOptionSelected && <TestCorpusTextArea />}
        <div className="flex space-x-4 items-center justify-center">
          {!fileOptionSelected && (
            <>
              <button
                className="w-20 h-8 rounded-md drop-shadow-lg text-black font-inter text-sm bg-bpegreen"
                onClick={() => setFileOptionSelected(false)}
              >
                Text
              </button>
              <button
                className="w-20 h-8 rounded-md drop-shadow-lg text-white font-inter text-sm bg-bpelightgrey hover:bg-zinc-900"
                onClick={() => setFileOptionSelected(true)}
              >
                File
              </button>
            </>
          )}
          {fileOptionSelected && (
            <>
              <button
                className="w-20 h-8 rounded-md drop-shadow-lg text-white font-inter text-sm bg-bpelightgrey hover:bg-zinc-900"
                onClick={() => setFileOptionSelected(false)}
              >
                Text
              </button>
              <button
                className="w-20 h-8 rounded-md drop-shadow-lg text-black font-inter text-sm bg-bpegreen"
                onClick={() => setFileOptionSelected(true)}
              >
                File
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-10 items-center justify-center">
        <SelectTokenizer
          isTokenizerSelected={tokenizerSelected}
          tokenizerIsSelected={setTokenizerSelected}
        />
      </div>
      <div className="flex flex-col space-y-10 items-center justify-center">
        <TestTitleInput />
      </div>
      <div className="flex justify-center items-center">
        <Link to="/user/tests/tokenized">
          <button>
            <div
              className="
bg-bpegreen hover:bg-green-500 text-black w-36 text-center h-12 shadow-lg drop-shadow-lg
rounded-xl flex p-4 items-center justify-center font-inter"
            >
              <p className="text-sm">Tokenize text</p>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TokenizeMenu;
