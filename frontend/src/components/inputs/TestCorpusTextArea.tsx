import React from "react";

const TestCorpusTextArea = () => {
  return (
    <div className="bg-transparent flex flex-col w-[30rem] rounded-md h-80 items-center justify-center">
      <textarea
        placeholder="Enter some text"
        className="w-[40rem] h-[19rem] p-2 border-solid border-2 border-bpelightgrey bg-black bg-opacity-50 rounded-md text-slate-300 outline-none font-mono text-xs resize-none"
      ></textarea>
    </div>
  );
};

export default TestCorpusTextArea;
