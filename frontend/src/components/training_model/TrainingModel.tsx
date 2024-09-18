import { useSelector } from "react-redux";
import OpenArrow from "../../assets/svgs/OpenArrow";
import TrainingItem from "./TrainingItem";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";

const TrainingModel = () => {

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const trainingQueue = useSelector((state: RootState) => state.trainingQueue.trainingQueue)
  const [isActive, setIsActive] = useState(false);
  const maxHeight = isActive ? '200px' : '32px';

  useEffect(() => { // Check if there are items in the training queue
    if (trainingQueue.length > 0) {
      setIsActive(true);
    }
  }, [trainingQueue]); // Add trainingQueue as a dependency

  return (
    <div>
      {!loggedIn ? ( // If not logged in do not display training queue
      <div></div>
      ):( // If logged in display training queue
      <div className="w-80 border-black rounded-lg m-8 drop-shadow-lg shadow-md flex">
          <div className="flex-col w-full">
            <div 
              className="flex overflow-hidden flex-col space-y-1 bg-bpeblack transition-all duration-300 ease-in-out"
              style={{ maxHeight }}
            >
            <div className="flex rounded-md rounded-b-none bg-bpelightgrey justify-between items-center">
              <p className="text-white font-inter pl-2 p-1 text-md">
                Training Queue
              </p>
              <span
                className={`pr-2 cursor-pointer transition-transform duration-300 ${
                  isActive ? "rotate-0" : "rotate-180"
                }`}
                onClick={() => setIsActive(!isActive)} // Toggle the isActive state
              >
                <OpenArrow />
              </span>
            </div>
            <div className="flex overflow-auto flex-col space-y-1 bg-bpeblack h-28">
              {trainingQueue.length > 0 && ( // Check if there are items in the training queue
                trainingQueue.map((item, index) => ( // Map over the training queue and render each item
                  <TrainingItem key={index} modelName={item.name} _id={item._id} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default TrainingModel;
