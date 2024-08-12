import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="bg-bpegrey">
      <Navbar />
      <div className="mx-auto min-w-xl min-h-screen my-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
