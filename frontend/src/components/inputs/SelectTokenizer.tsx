import { useState, useEffect } from "react";
import OpenArrow from "../../assets/svgs/OpenArrow";

// Define the props interface
interface SelectTokenizerProps {
  isTokenizerSelected: boolean; // Prop to indicate if a tokenizer is selected
  tokenizerIsSelected: (selected: boolean, tokenizer_id: string | null) => void; // Callback function to handle tokenizer selection
  modelsPageModelId?: string | undefined; // Prop to get the ID of the selected model from the view models page
  modelsPageName?: string | undefined; // Prop to get the name of the selected model from the view models page
}

// Define the Model interface
interface Model {
  _id: string | null;
  name: string;
  subword_vocab_count: number;
  trained: boolean;
}

// Define the SelectTokenizer component
const SelectTokenizer: React.FC<SelectTokenizerProps> = ({
  isTokenizerSelected, // Prop to indicate if a tokenizer is selected
  tokenizerIsSelected, // Callback function to handle tokenizer selection
  modelsPageModelId, // Prop to get the ID of the selected model from the view models page
  modelsPageName, // Prop to get the name of the selected model from the view models page
}) => {
  const [tokenizerDrawerOpen, setTokenizerDrawerOpen] = useState(false); // State to control the visibility of the tokenizer drawer
  const [tokenizerName, setTokenizerName] = useState(""); // State to store the name of the selected tokenizer
  const [models, setModels] = useState<Model[]>([]); // State to store the list of models
  const [loading, setLoading] = useState(false); // State to track the loading state

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  // Function to toggle the visibility of the tokenizer drawer
  const checkPreviousSelection = () => {
    if (modelsPageModelId && modelsPageName) {
      setTokenizerName(modelsPageName);
      tokenizerIsSelected(!!modelsPageModelId, modelsPageModelId);
    }
  };

  // Fetch the list of models when the component mounts, and modelsPageModelId/ modelsPageName is passed from view models page
  useEffect(() => {
    checkPreviousSelection();
  }, [modelsPageModelId, modelsPageName]);

  // Function to handle the selection of a tokenizer
  useEffect(() => {
    if (tokenizerDrawerOpen) {
      // If the tokenizer drawer is open, fetch the list of models
      const fetchModels = async () => {
        setLoading(true); // Set the loading state to true
        try {
          const token = localStorage.getItem("token"); // Get the token from local storage
          let response;
          if (!token) {
            response = await fetch(`${apiUrl}/api/tokenizer/models`);
          } else {
            response = await fetch(`${apiUrl}/api/tokenizer/models`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
          const data = await response.json();
          if (response.ok) {
            // If the response is successful, set the list of models
            setModels(data.models);
          } else {
            console.error("Failed to fetch models:", data.error);
          }
        } catch (error) {
          console.error("Error fetching models:", error);
        }
        setLoading(false); // Set the loading state to false once the request is complete
      };

      fetchModels(); // Call the fetchModels function
    }
  }, [tokenizerDrawerOpen]); // Run the effect whenever the tokenizerDrawerOpen state changes

  // Function to format the vocabulary count
  const formatVocabularyCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`; // Format the vocabulary count as a string with a thousand separator
    }
    return count.toString();
  };

  // Function to handle the selection of a tokenizer
  const handleTokenizerSelect = (name: string, _id: string | null) => {
    setTokenizerName(name); // Set the name of the selected tokenizer
    setTokenizerDrawerOpen(false); // Close the tokenizer drawer
    tokenizerIsSelected(!!_id, _id); // Call the tokenizerIsSelected callback function with the selected tokenizer ID
  };

  return (
    <div className="flex flex-col">
      {/* Tokenizer Selector */}
      <div className="flex flex-row bg-bpelightgrey p-3 space-x-1 rounded-md rounded-b-none items-center justify-center">
        <div className="flex flex-col space-y-1 max-w-sm justify-left items-start">
          <label className="text-xs font-medium font-inter text-gray-200">
            Tokenizer to use *
          </label>
          <div className="flex flex-row items-center justify-center">
            <p
              className={`w-80 bg-transparent rounded-sm ${
                isTokenizerSelected ? "text-white" : "text-red-500"
              } font-inter text-sm`}
            >
              {isTokenizerSelected ? tokenizerName : "Select a tokenizer"}
            </p>
          </div>
        </div>
        <button onClick={() => setTokenizerDrawerOpen((prev) => !prev)}>
          <OpenArrow />
        </button>
      </div>
      {/* Tokenizer Drawer to display the list of models */}
      {tokenizerDrawerOpen && (
        <div>
          {loading ? (
            <p className="text-white font-inter text-sm">Loading models...</p> // If the loading state is true, display a loading message
          ) : // If the loading state is false, render the list of models
          models.length > 0 ? ( // If the list of models is not empty, render the list of models
            models
              .filter((model) => model.name !== tokenizerName && model.trained) // Filter out the selected tokenizer
              .map(
                (
                  model // Map over the list of models
                ) => (
                  <li // Render a list item for each model
                    key={model._id}
                    onClick={() => handleTokenizerSelect(model.name, model._id)} // Call the handleTokenizerSelect function when the list item is clicked
                    className="flex flex-row h-12 border-b-2 border-white border-opacity-20 justify-between items-center bg-bpeblack hover:bg-bpelightgrey"
                  >
                    <div className="text-white font-inter text-sm pl-2">
                      {model.name}
                    </div>
                    <div className="text-bpegreen font-inter text-xs pr-2">
                      {formatVocabularyCount(model.subword_vocab_count)}
                      Vocabulary
                    </div>
                  </li>
                )
              )
          ) : (
            <p className="text-white font-inter text-sm">No models found</p> // If the list of models is empty, render a message
          )}
        </div>
      )}
    </div>
  );
};

export default SelectTokenizer;
