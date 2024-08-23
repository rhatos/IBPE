import React from "react";
import UploadSVG from "../../assets/svgs/UploadSVG";

const TestCorpusUpload = () => {
  return (
    <div className="bg-bpelightgrey flex flex-col w-[40rem] rounded-md h-[19rem] items-center justify-center">
      <div className="pr-32 pl-32 pt-16 pb-16 border-dashed border-2 rounded-lg">
        <UploadSVG></UploadSVG>
      </div>
      <span className=" text-white pt-5">Upload Test Corpus</span>
      <span className=" text-white text-xs">File must be .txt*</span>
    </div>
  );
};

export default TestCorpusUpload;
