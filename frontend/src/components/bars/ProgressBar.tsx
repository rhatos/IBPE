import React, { useEffect, useState } from "react";

const ProgressBar = ({}) => {
  const [filled, setFilled] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (filled < 100 && isRunning) {
      setTimeout(() => setFilled((prev) => (prev += 1)), 2000);
    }
  }, [filled, isRunning]);

  if (filled >= 100 && isRunning) {
    console.log("Done");
    setIsRunning(false);
  }

  return (
    <div className="absolute h-2 w-52 bg-bpegrey dark:bg-bpelightgrey">
      <div className="absolute h-2 w-0.5 right-2/3 bg-black"></div>
      <div className="absolute h-2 w-0.5 right-1/3 bg-black"></div>
      <div className="absolute h-2 w-0.5 right-3/3 bg-black"></div>
      <div className="h-2 bg-bpegreen" style={{ width: `${filled}%` }}></div>
    </div>
  );
};

export default ProgressBar;
