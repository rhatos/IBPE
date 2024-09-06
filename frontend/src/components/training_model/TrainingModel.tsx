import { useSelector } from "react-redux";
import OpenArrow from "../../assets/svgs/OpenArrow";
import TrainingItem from "./TrainingItem";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";

const TrainingModel = () => {

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const trainingQueue = useSelector((state: RootState) => state.trainingQueue.trainingQueue)

  const [isActive, setIsActive] = useState(false);
  const minimize = isActive ? '' : 'h-1';

  useEffect(() => {
    if (trainingQueue.length > 0) {
      setIsActive(true);
    }
  }, [trainingQueue]);

  return (
    <div>
      {!loggedIn ? (
      <div></div>
      ):(
      <div className="w-80 border-black rounded-lg m-8 drop-shadow-lg shadow-md flex">
          <div className="flex-col w-full">
            <div className={minimize}>
            <div className="flex rounded-md rounded-b-none bg-bpelightgrey justify-between items-center">
              <p className="text-white font-inter pl-2 p-1 text-md">
                Training Queue
              </p>
              <span className="pr-2 cursor-pointer"
              onClick={() => setIsActive(!isActive)}
              >
                <OpenArrow />
              </span>
            </div>
            <div className="flex overflow-auto flex-col space-y-1 bg-bpeblack h-28">
              {trainingQueue.length > 0 && (
                trainingQueue.map((item, index) => (
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
