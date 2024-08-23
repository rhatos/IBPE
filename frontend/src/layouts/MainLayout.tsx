import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import TrainingModel from "../components/training_model/TrainingModel";

const MainLayout = () => {
  return (
    <div className="bg-bpegrey">
      <Navbar />
      <div className="mx-auto min-w-xl min-h-screen my-auto">
        <Outlet />
      </div>

      <div className="fixed bottom-0 right-0">
        <TrainingModel />
      </div>
    </div>
  );
};

export default MainLayout;
