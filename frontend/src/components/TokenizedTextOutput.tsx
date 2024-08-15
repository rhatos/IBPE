import React from "react";

const TokenizedTextOutput = () => {
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center justify-center">
        <h1 className="text-4xl font-inter font-medium text-white">
          <span className="text-bpegreen">Tokenized</span> Text
        </h1>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex p-2">
          <p className="text-white pb-4 font-inter text-md">
            Below is a visual representation of how your text was tokenized.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-5">
          <div className="w-[40rem] h-[19rem] p-2 border-solid border-2 border-bpelightgrey bg-black bg-opacity-50 rounded-md text-slate-300 outline-none font-mono text-sm resize-none">
            <p>
              <span className="bg-tokenpurple">According</span>
              <span className="bg-tokengreen"> to </span>
              <span className="bg-tokenyellow">legend</span>
              <span className="bg-tokenred">,</span>
              <span className="bg-tokenblue"> in</span>
              <span className="bg-tokenpurple"> the</span>
              <span className="bg-tokengreen"> ancient</span>
              <span className="bg-tokenyellow"> Mid</span>
              <span className="bg-tokenred">land</span>
              <span className="bg-tokenblue"> empire</span>
              <span className="bg-tokenpurple"> ruled</span>
              <span className="bg-tokengreen"> by</span>
              <span className="bg-tokenyellow"> G</span>
              <span className="bg-tokenred">ais</span>
              <span className="bg-tokenblue">eric</span>
              <span className="bg-tokenpurple">,</span>
              <span className="bg-tokengreen"> disaster</span>
              <span className="bg-tokenyellow"> destroyed</span>
              <span className="bg-tokenred"> the</span>
              <span className="bg-tokenblue"> imperial</span>
              <span className="bg-tokenpurple"> capital</span>
              <span className="bg-tokengreen"> city</span>
              <span className="bg-tokenyellow"> and</span>
              <span className="bg-tokenred"> was</span>
              <span className="bg-tokenblue"> brought</span>
              <span className="bg-tokenpurple"> forth</span>
              <span className="bg-tokengreen"> by</span>
              <span className="bg-tokenyellow"> four</span>
              <span className="bg-tokenred"> or</span>
              <span className="bg-tokenblue"> five</span>
              <span className="bg-tokenpurple"> angels</span>
              <span className="bg-tokengreen">.</span> <br /> <br />{" "}
              <span className="bg-tokenyellow">All</span>
              <span className="bg-tokenred"> that</span>
              <span className="bg-tokenblue"> remains</span>
              <span className="bg-tokenpurple"> are</span>
              <span className="bg-tokengreen"> traces</span>
              <span className="bg-tokenyellow"> of</span>
              <span className="bg-tokenred"> the</span>
              <span className="bg-tokenblue"> fallen</span>
              <span className="bg-tokenpurple"> kingdom</span>
              <span className="bg-tokengreen"> that</span>
              <span className="bg-tokenyellow"> were</span>
              <span className="bg-tokenred"> buried</span>
              <span className="bg-tokenblue"> under</span>
              <span className="bg-tokenpurple"> the</span>
              <span className="bg-tokengreen"> land</span>
              <span className="bg-tokenyellow"> which</span>
              <span className="bg-tokenred"> Wy</span>
              <span className="bg-tokenblue">nd</span>
              <span className="bg-tokenpurple">ham</span>
              <span className="bg-tokengreen"> would</span>
              <span className="bg-tokenyellow"> come</span>
              <span className="bg-tokenred"> to</span>
              <span className="bg-tokenblue"> be</span>
              <span className="bg-tokenpurple"> built</span>
              <span className="bg-tokengreen"> upon</span>
              <span className="bg-tokenyellow">.</span>
              <span className="bg-tokenred"> The</span>
              <span className="bg-tokenblue"> ruins</span>
              <span className="bg-tokenpurple"> of</span>
              <span className="bg-tokengreen"> the</span>
              <span className="bg-tokenyellow"> ancient</span>
              <span className="bg-tokenred"> imperial</span>
              <span className="bg-tokenblue"> city</span>
              <span className="bg-tokenpurple"> and</span>
              <span className="bg-tokengreen"> its</span>
              <span className="bg-tokenyellow"> litter</span>
              <span className="bg-tokenred">ed</span>
              <span className="bg-tokenblue"> dead</span>
              <span className="bg-tokenpurple">,</span>
              <span className="bg-tokengreen"> all</span>
              <span className="bg-tokenyellow"> bearing</span>
              <span className="bg-tokenred"> the</span>
              <span className="bg-tokenblue"> Brand</span>
              <span className="bg-tokenpurple"> of</span>
              <span className="bg-tokengreen"> Sacr</span>
              <span className="bg-tokenyellow">ifice</span>
              <span className="bg-tokenred"> on</span>
              <span className="bg-tokenblue"> their</span>
              <span className="bg-tokenpurple"> fore</span>
              <span className="bg-tokengreen">heads</span>
              <span className="bg-tokenyellow">,</span>
              <span className="bg-tokenred"> could</span>
              <span className="bg-tokenblue"> be</span>
              <span className="bg-tokenpurple"> found</span>
              <span className="bg-tokengreen"> at</span>
              <span className="bg-tokenyellow"> the</span>
              <span className="bg-tokenred"> bottom</span>
              <span className="bg-tokenblue"> of</span>
              <span className="bg-tokenpurple"> the</span>
              <span className="bg-tokengreen"> Tower</span>
              <span className="bg-tokenyellow"> of</span>
              <span className="bg-tokenred"> Re</span>
              <span className="bg-tokenblue">birth</span>
              <span className="bg-tokenpurple">.</span>
            </p>
          </div>

          <div className="flex flex-row text-white font-inter text-center space-x-10 bg-bpelightgrey w-[40rem] justify-between p-2 rounded-xl drop-shadow-lg">
            <div className="flex items-center flex-col">
              <p className="font-bold text-bpegreen">Characters</p>
              <p>457</p>
            </div>

            <div className="flex items-center flex-col">
              <p className="font-bold text-bpegreen">Tokens</p>
              <p>96</p>
            </div>

            <div className="flex items-center flex-col">
              <p className="font-bold text-bpegreen">Token to Word Ratio</p>
              <p>3/4</p>
            </div>

            <div className="flex items-center flex-col">
              <p className="font-bold text-bpegreen">% of Vocabulary Used</p>
              <p>92%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row space-x-5">
        <button className="w-20 h-8 rounded-md drop-shadow-lg text-black font-inter text-sm bg-bpegreen">
          Export
        </button>
      </div>
    </div>
  );
};

export default TokenizedTextOutput;
