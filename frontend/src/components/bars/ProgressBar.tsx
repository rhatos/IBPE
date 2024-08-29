import { useEffect, useState } from "react";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { removeFromTrainingQueue } from "../../slices/trainingSlice";

interface ProgressBarProps {
  name: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ name }) => {
  const dispatch: AppDispatch = useDispatch();
  const [filled, setFilled] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (filled < 100 && isRunning) {
      timeout = setTimeout(() => {
        setFilled((prev) => Math.min(prev + 10, 100));
      }, 500);
    }

    return () => clearTimeout(timeout);
  }, [filled, isRunning]);

  useEffect(() => {
    if (filled >= 100 && isRunning) {
      console.log("Done");
      setIsRunning(false);
      dispatch(removeFromTrainingQueue({ name }));
    }
  }, [filled, isRunning, dispatch, name]);

  return (
    <div className="relative h-2 w-52 bg-bpegrey dark:bg-bpelightgrey">
      <div className="absolute h-2 w-0.5 right-2/3 bg-black"></div>
      <div className="absolute h-2 w-0.5 right-1/3 bg-black"></div>
      <div className="absolute h-2 w-0.5 right-3/3 bg-black"></div>
      <div className="h-2 bg-bpegreen" style={{ width: `${filled}%` }}></div>
    </div>
  );
};

export default ProgressBar;
