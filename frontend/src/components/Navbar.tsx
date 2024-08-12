import React from "react";
import LoginButton from "./buttons/LoginButton";
import RegisterButton from "./buttons/RegisterButton";

const Navbar = () => {
  return (
    <div className="bg-bpeblack rounded-b-sm w-full mx-auto mb-10">
      <div className="flex justify-between items-center p-3">
        <div className="flex space-x-4 ">
          <p className="text-xl text-white font-medium font-inter">
            Interactive <span className="text-bpegreen"> BPE</span> Tool
          </p>
        </div>
        <div className="flex space-x-2">
          <LoginButton />
          <RegisterButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
