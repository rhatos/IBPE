import React from "react";
import UserSVG from "../../assets/svgs/UserSVG";

const UserButton = () => {
  return (
    <div className="pl-2 text-gray-200 hover:text-white flex items-center font-medium font-inter text-xs">
      <UserSVG />
      Conor
    </div>
  );
};

export default UserButton;
