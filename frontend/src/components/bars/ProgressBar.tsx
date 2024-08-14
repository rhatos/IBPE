import React, { useEffect, useState } from "react";

const ProgressBar = ({ changePageState }) => {
  const [filled, setFilled] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (filled < 100 && isRunning) {
      setTimeout(() => setFilled((prev) => (prev += 1)), 25);
    }
  }, [filled, isRunning]);

  if (filled >= 100 && isRunning) {
    console.log("Done");
    setIsRunning(false);
    changePageState();
  }

  return (
    <div className="absolute h-4 w-1/2 bg-bpegrey dark:bg-bpelightgrey">
      <div className="h-4 bg-bpegreen" style={{ width: `${filled}%` }}></div>
    </div>
  );
};

export default ProgressBar;
