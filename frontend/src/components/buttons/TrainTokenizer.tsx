import React from "react";
import { Link } from "react-router-dom";

const TrainTokenizer = () => {
  return (
    <Link to="/tokenize">
      <div
        className="
bg-bpegreen hover:bg-green-500 text-black w-36 text-center h-12 shadow-lg drop-shadow-lg
rounded-xl flex p-4 items-center justify-center font-inter"
      >
        <p className="text-sm">Start training</p>
      </div>
    </Link>
  );
};

export default TrainTokenizer;
