import React, { useState } from "react";
import TestCorpusUpload from "./inputs/TestCorpusUpload";
import SelectTokenizer from "./inputs/SelectTokenizer";
import TestCorpusTextArea from "./inputs/TestCorpusTextArea";

const TokenizeMenu = () => {
  const [tokenizerSelected, setTokenizerSelected] = useState(false);
  const [fileOptionSelected, setFileOptionSelected] = useState(false);

  return (
    <div className="flex-col">
      <div className="flex flex-col space-y-10 items-center justify-center">
        <h1 className="text-4xl font-inter font-medium text-white">
          {/* Page Title */}
          <span className="text-bpegreen">Test</span> Tokenizer
        </h1>
        {fileOptionSelected && <TestCorpusUpload />}
        {!fileOptionSelected && <TestCorpusTextArea />}
      </div>
      <div className="flex space-x-4">
        <div>Text</div>
        <div>File</div>
      </div>
      <div className="flex flex-col space-y-10 items-center justify-center">
        <SelectTokenizer
          isTokenizerSelected={tokenizerSelected}
          tokenizerIsSelected={setTokenizerSelected}
        />
      </div>
    </div>
  );
};

export default TokenizeMenu;
