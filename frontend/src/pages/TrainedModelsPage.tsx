import { useEffect, useState } from "react";
import TrainedModelItem from "../components/TrainedModelItem";
import { Link } from "react-router-dom";

interface Model {
  _id: string | null;
  name: string;
  subword_vocab_count: number;
  trained: boolean;
}

const TrainedModelsPage = () => {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:5000/api/tokenizer/models', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
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
  }, []);

  const handleModelDelete = () => {
    const fetchModels = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:5000/api/tokenizer/models', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
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
      <div className="flex flex-col justify-center items-center space-y-4 pb-20">
        <h1 className="text-4xl font-inter font-medium text-white">
          <span className="text-bpegreen">Trained</span> Models
        </h1>
      </div>

      <div className="flex flex-col space-y-2">
        {models.length > 0 ? (
          models.map((model) => (
            <TrainedModelItem
              key={model._id}
              name={model.name}
              subword_vocab_count={model.subword_vocab_count}
              _id={model._id}
              trained={model.trained}
              onDelete={handleModelDelete}
            />
          ))
        ) : (
          <p className="text-white">No models found</p>
        )}
      </div>

      <div className="flex items-center justify-center p-4">
        <Link to="/train">
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
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default TrainedModelsPage;