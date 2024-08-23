import React from "react";
import TrainedModelItem from "../components/TrainedModelItem";
import { Link } from "react-router-dom";

const TrainedModelsPage = () => {
  return (
    <div className="w-2/5 mx-auto">
      <div className="flex flex-col justify-center items-center space-y-4 pb-20">
        <h1 className="text-4xl font-inter font-medium text-white">
          {/* Page Title */}
          <span className="text-bpegreen">Trained</span> Models
        </h1>
      </div>
      <div className="flex flex-col space-y-2">
        {/* Model item */}
        <TrainedModelItem modelName={"Model 1"} />
        <TrainedModelItem modelName={"Model 2"} />
        <TrainedModelItem modelName={"Model 3"} />
      </div>

      <div className="flex items-center justify-center p-4">
        <Link to="/train">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            className="size-14 hover:stroke-bpegreen"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default TrainedModelsPage;
