import { useEffect, useState } from "react";
import TrainedModelItem from "../components/TrainedModelItem";
import { Link } from "react-router-dom";

// Define the interface for a model object
interface Model {
  _id: string | null;
  name: string;
  subword_vocab_count: number;
  trained: boolean;
  training_time: number;
}

const TrainedModelsPage = () => {
  // State to store the list of models
  const [models, setModels] = useState<Model[]>([]);

  // useEffect to fetch models when the component mounts
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        const response = await fetch(
          "http://172.29.163.22:5000/api/tokenizer/models",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setModels(data.models); // If response is OK, update state with the models
        } else {
          console.error("Failed to fetch models:", data.error);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels(); // Call the function to fetch models
  }, []); // Dependency array is empty, so this runs only on mount

  // Function to handle model change and re-fetch models after deletion
  const handleModelChange = () => {
    const fetchModels = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://172.29.163.22:5000/api/tokenizer/models",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setModels(data.models);
        } else {
          console.error("Failed to fetch models:", data.error);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  };

  return (
    <div className="w-2/5 mx-auto">
      {" "}
      {/* Center the content and restrict width */}
      <div className="flex flex-col justify-center items-center space-y-4 pb-20">
        {" "}
        {/* Header section */}
        <h1 className="text-4xl font-inter font-medium text-white">
          <span className="text-bpegreen">Trained</span> Models
        </h1>
      </div>
      <div className="flex flex-col space-y-2">
        {" "}
        {/* List of trained models */}
        {models.length > 0 ? ( // Check if there are any models to display
          models.map(
            (
              model // Map through models and render each as a TrainedModelItem component
            ) => (
              <TrainedModelItem
                key={model._id} // Unique key for each item
                name={model.name} // Pass model name
                subword_vocab_count={model.subword_vocab_count} // Pass model vocabulary size
                _id={model._id} // Pass model ID
                trained={model.trained} // Pass model training status
                training_time={model.training_time}
                onChange={handleModelChange} // Pass change handler
              />
            )
          )
        ) : (
          <p className="text-white">No models found</p> // Show message if no models are found
        )}
      </div>
      <div className="flex items-center justify-center p-4">
        {" "}
        {/* Button to add a new model */}
        <Link to="/train">
          {" "}
          {/* Link to navigate to the "train" page */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="size-14 hover:stroke-bpegreen"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" // Plus sign icon
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default TrainedModelsPage; // Export the component
