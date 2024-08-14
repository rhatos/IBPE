import React from "react";
import TestCorpusUpload from "./inputs/TestCorpusUpload";

const TokenizeMenu = () => {
  return (
    <div className="flex flex-col space-y-10 items-center justify-center">
      <>
        <h1 className="text-4xl font-inter font-medium text-white">
          {/* Page Title */}
          <span className="text-bpegreen">Test</span> Tokenizer
        </h1>
        <TestCorpusUpload />
      </>
    </div>
  );
};

export default TokenizeMenu;
