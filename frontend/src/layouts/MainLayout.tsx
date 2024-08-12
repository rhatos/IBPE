import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="bg-bpegrey">
      <div className="mx-auto border-5 border-black min-w-xl max-w-xl h-fit">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
