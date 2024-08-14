import React from "react";

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {};

const TrainAnotherModel = (props: Props) => {
  return (
    <button {...props}>
      <div
        className="
bg-bpegreen hover:bg-green-500 text-black w-36 text-center h-12 shadow-lg drop-shadow-lg
rounded-xl flex p-4 items-center justify-center font-inter"
      >
        <p className="text-sm">Train new model</p>
      </div>
    </button>
  );
};

export default TrainAnotherModel;
