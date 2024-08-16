
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../store/store";
import { removeFromTrainingQueue } from "../../slices/trainingSlice";

const TrainingItem = ({ modelName}: {modelName: string }) => {

  const dispatch: AppDispatch = useDispatch();
  const [filled, setFilled] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (filled < 100 && isRunning) {
      setTimeout(() => setFilled((prev) => (prev += 10)), 500);
    }
  }, [filled, isRunning]);

  if (filled >= 100 && isRunning) {
    console.log("Done");
    setIsRunning(false);
    dispatch(removeFromTrainingQueue({name: modelName}))
  }


  return (
    <div className="justify-center flex flex-col space-y-2 text-white border-b-2 border-opacity-10 border-gray-500 h-fit w-full p-1 pl-2">
      <div className="flex space-x-2 ">
        <p className="text-sm font-inter">{modelName}</p>
        <div className="flex items-center pl-5">
        <div className="absolute h-2 w-52 bg-bpegrey dark:bg-bpelightgrey">
          <div className="absolute h-2 w-0.5 right-2/3 bg-black"></div>
          <div className="absolute h-2 w-0.5 right-1/3 bg-black"></div>
          <div className="absolute h-2 w-0.5 right-3/3 bg-black"></div>
          <div className="h-2 bg-bpegreen" style={{ width: `${filled}%` }}></div>
          </div>
          {/* <ProgressBar name = {modelName}></ProgressBar> */}
        </div>
      </div>
    </div>
  );
};

export default TrainingItem;
