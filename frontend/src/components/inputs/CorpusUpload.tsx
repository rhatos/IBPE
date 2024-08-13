import React from "react";
import UploadSVG from "../../assets/svgs/UploadSVG";

const CorpusUpload = () => {
  return (
    <div className="bg-bpelightgrey flex flex-col w-96 rounded-md h-64 items-center justify-center">
      <div className="pr-32 pl-32 pt-16 pb-16 border-dashed border-2 rounded-lg">
        <UploadSVG></UploadSVG>
      </div>
      <div className=" text-white pt-5">Upload Training Corpus</div>
    </div>
  );
};

export default CorpusUpload;
