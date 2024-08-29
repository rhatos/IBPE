import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const TrainTokenizer = (props: Props) => {
  return (
    <button {...props}>
      <div
        className="bg-bpegreen hover:bg-green-500 text-black w-36 text-center h-12 shadow-lg drop-shadow-lg rounded-xl flex p-4 items-center justify-center font-inter"
        >
        <p className="text-sm">Start training</p>
      </div>
    </button>
  );
};

export default TrainTokenizer;