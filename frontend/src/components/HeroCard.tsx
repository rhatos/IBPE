import React from "react";

const HeroCard = () => {
  return (
    <div className="w-full mx-auto">
      <div className="flex">
        <h1 className="text-4xl">BPE Tokenizer</h1>
        <p>
          BPE (Byte Pair Encoding) tokenization is a method used in natural
          language processing (NLP) to break down text into subword units,
          rather than just words or characters. This approach is particularly
          effective for handling rare words, reducing vocabulary size, and
          improving the efficiency of language models.
        </p>
      </div>
    </div>
  );
};

export default HeroCard;
