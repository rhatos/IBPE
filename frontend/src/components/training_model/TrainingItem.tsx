import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { AppDispatch } from "../../store/store";
import { removeFromTrainingQueue } from "../../slices/trainingSlice";

// Child Component of the TrainingModel component
const TrainingItem = ({
  modelName,
  _id,
}: {
  modelName: string;
  _id: string;
}) => {
  // Define the props for the component
  const dispatch: AppDispatch = useDispatch();
  const progressBarRef = useRef<HTMLDivElement>(null); // Ref for the progress bar
  const finalUpdateRef = useRef<boolean>(false); // Ref to track if the final update has been made

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    // Effect to update the progress bar
    let filled = 10; // Initial width of the progress bar
    let isRunning = true; // Flag to track if the progress bar is still running

    // Function to update the progress bar
    if (progressBarRef.current && isRunning) {
      const interval = setInterval(async () => {
        // Interval to update the progress bar
        // Fetch the status of the training process
        try {
          const response = await fetch(
            `${apiUrl}/api/tokenizer/status?tokenizer_id=${_id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          if (response.ok) {
            // Check if the training process is complete
            if (data.trained === "true") {
              if (progressBarRef.current) {
                progressBarRef.current.style.width = "100%"; // Set the width of the progress bar to 100%
              }
              finalUpdateRef.current = true; // Set the flag to indicate that the final update has been made
              isRunning = false; // Stop the progress bar

              setTimeout(() => {
                // Remove the item from the training queue after a delay
                dispatch(removeFromTrainingQueue({ name: modelName, _id })); // Dispatch the action to remove the item from the training queue
              }, 500); // Set a delay before removing the item from the training queue

              clearInterval(interval); // Clear the interval
            } else {
              filled = Math.min(
                filled + Math.max(1, 25 * Math.exp(-0.05 * filled)),
                100
              ); // Update the width of the progress bar using an exponential function
              if (progressBarRef.current) {
                progressBarRef.current.style.width = `${filled}%`; // Set the width of the progress bar
              }
            }
          } else {
            console.error("Error fetching training status:", data.error);
          }
        } catch (err) {
          console.error("Error checking training status:", err);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dispatch, _id, modelName]);

  return (
    <div className="flex flex-col space-y-1 text-white border-b-2 border-opacity-10 border-gray-500 w-full p-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-inter truncate max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
          {modelName}
        </p>
        <div className="relative h-3 w-48 bg-bpegrey rounded-lg overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-bpegreen transition-all duration-700 ease-in-out"
            ref={progressBarRef}
            style={{ width: "10%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TrainingItem;
