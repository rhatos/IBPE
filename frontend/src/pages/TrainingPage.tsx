import React from "react";
import TrainMenu from "../components/TrainMenu";

const TrainingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6">
      <h1 className="text-4xl font-inter font-medium text-white">
        {/* Page Title */}
        <span className="text-bpegreen">Train</span> Tokenizer
      </h1>
      {/* Training Form */}
      <TrainMenu />
    </div>
  );
};

export default TrainingPage;
