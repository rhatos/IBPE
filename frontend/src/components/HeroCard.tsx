import React from "react";

import bpeimage from "../assets/BPEImage.png";
import TrainNowButton from "./buttons/TrainNowButton";

const HeroCard = () => {
  return (
    <div className=" rounded-2xl w-2/5 mx-auto ">
      <div className="flex justify-between bg-bpegrey m-3 rounded-2xl">
        <div className="flex-col space-y-5  w-full p-8">
          <h1 className="text-4xl font-inter font-medium text-white">
            <span className="text-bpegreen">BPE</span> Tokenizer
          </h1>
          <p className="text-white text-md font-inter font-light pb-4">
            BPE (Byte Pair Encoding) tokenization is a method used in natural
            language processing (NLP) to break down text into subword units,
            rather than just words or characters. <br /> <br /> This approach is
            particularly effective for handling rare words, reducing vocabulary
            size, and improving the efficiency of language models.
          </p>
          <TrainNowButton />
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
