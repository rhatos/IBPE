import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { AppDispatch } from "../../store/store";
import { removeFromTrainingQueue } from "../../slices/trainingSlice";

const TrainingItem = ({ modelName, _id }: { modelName: string, _id: string }) => {
  const dispatch: AppDispatch = useDispatch();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const finalUpdateRef = useRef<boolean>(false);

  useEffect(() => {
    let filled = 10;
    let isRunning = true;

    if (progressBarRef.current && isRunning) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/tokenizer/status?tokenizer_id=${_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          if (response.ok) {
            if (data.trained === 'true') {
              if (progressBarRef.current) {
                progressBarRef.current.style.width = "100%";
              }
              finalUpdateRef.current = true;
              isRunning = false;

              setTimeout(() => {
                dispatch(removeFromTrainingQueue({ name: modelName, _id }));
              }, 500);

              clearInterval(interval);
            } else {
              filled = Math.min(filled + Math.max(1, 25 * Math.exp(-0.05 * filled)), 100);
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${filled}%`;
              }
            }
          } else {
            console.error('Error fetching training status:', data.error);
          }
        } catch (err) {
          console.error('Error checking training status:', err);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dispatch, _id, modelName]);

  return (
    <div className="justify-center flex flex-col space-y-2 text-white border-b-2 border-opacity-10 border-gray-500 h-fit w-full p-1 pl-2">
      <div className="flex space-x-2 ">
        <p className="text-sm font-inter truncate max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
          {modelName}
        </p>
        <div className="flex items-center pl-5">
          <div className="relative h-2 w-52 bg-bpegrey dark:bg-bpelightgrey">
            <div className="absolute h-2 w-0.5 right-2/3 bg-black"></div>
            <div className="absolute h-2 w-0.5 right-1/3 bg-black"></div>
            <div className="absolute h-2 w-0.5 right-3/3 bg-black"></div>
            <div
              className="h-2 bg-bpegreen transition-all duration-500"
              ref={progressBarRef}
              style={{ width: "10%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingItem;
