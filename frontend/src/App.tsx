import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import TrainingPage from "./pages/TrainingPage";
import TokenizePage from "./pages/TokenizePage";
import TrainedModelsPage from "./pages/TrainedModelsPage";
import TokenizedTextPage from "./pages/TokenizedTextPage";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Navigate to="/home" />} /> {/* Redirect root path to /home */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/train" element={<TrainingPage />} />
      <Route path="/user/model/tokenize" element={<TokenizePage />} />
      <Route path="/user/models" element={<TrainedModelsPage />} />
      <Route path="/user/tests/tokenized" element={<TokenizedTextPage />} />
    </Route>
  )
);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
