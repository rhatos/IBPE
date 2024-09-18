import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Props interface for TrainedModelItem component
interface TrainedModelItemProps {
  _id: string | null; // The ID of the trained model
  name: string; // Name of the model
  tokens: Array<string>; // Subword vocabulary count (number of tokens)
  trained: boolean; // Whether the model is trained or still in training
  training_time: number; // Time taken to train the model
  onChange: () => void; // Callback function when the model is deleted
}

// Function to format the vocabulary count for display
const formatVocabularyCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`; // Format to 'k' for thousands
  }
  return count.toString();
};

// Main component definition
const TrainedModelItem = ({
  name,
  tokens,
  _id,
  trained,
  training_time,
  onChange,
}: TrainedModelItemProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // State to control edit mode
  const [newName, setNewName] = useState(name); // State to hold the edited name

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  // Handle delete button click
  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      const requestData = {
        tokenizer_id: _id, // Model ID to be deleted
      };

      const response = await fetch(`${apiUrl}/api/tokenizer/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Failed to delete model:", data.error);
        return;
      } else {
        onChange(); // Call the onDelete callback to update the UI
        console.log("Model deleted successfully:", data);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  // Navigate to the tokenization page for testing the model
  const handleTestClick = () => {
    navigate("/user/model/tokenize", { state: { modelId: _id, name: name } });
  };

  // Handle edit button click
  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${apiUrl}/api/tokenizer/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tokenizer_id: _id,
            tokenizer_new_name: newName,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsEditing(false); // Exit edit mode
          onChange(); // Call the onDelete callback to update the UI
        } else {
          console.log("Failed to update model:", data.error);
          onChange(); // Call the onDelete callback to update the UI
        }
      } catch (error) {
        console.error("Error during update:", error);
        onChange(); // Call the onDelete callback to update the UI
      }
    } else {
      setIsEditing(!isEditing); // Toggle edit mode
    }
  };

  // Handle Enter key press to submit the new name
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditClick();
    }
  };

  return (
    <div className="flex flex-row bg-bpelightgrey justify-between items-center rounded-lg drop-shadow-lg">
      <div className="flex flex-col p-4">
        <div className="flex items-center">
          {isEditing ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)} // Update new name in state
              onBlur={() => setIsEditing(false)} // Exit edit mode on blur
              onKeyDown={handleKeyDown} // Submit on Enter key press
              autoFocus
              className="text-white font-inter text-xl bg-bpelightgrey border-b border-white"
            />
          ) : (
            <>
              <h1 className="text-white font-inter text-xl">
                {name}
                {!trained && <span className="text-red-500">(Training)</span>}
                {/* Display (Training) if model is not trained */}
              </h1>
              <button
                onClick={handleEditClick}
                className="text-blue-400 hover:underline text-sm ml-2"
              >
                Edit
              </button>
            </>
          )}
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <p className="text-white font-inter text-sm">Vocabulary Size:</p>
          <span className="text-bpegreen font-inter text-sm">
            {formatVocabularyCount(tokens.length)}
          </span>
          {/* Formatted vocabulary count */}
          <span className="text-white font-inter text-xs">(Tokens)</span>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <p className="text-white font-inter text-sm">Training Time</p>
          <span className="text-bpegreen font-inter text-sm">
            {training_time.toPrecision(4)}s
          </span>
          {/* Formatted Training Time */}
        </div>
      </div>
      <div className="flex flex-col text-black items-center justify-center p-4 space-y-2">
        <button
          className={`flex items-center w-20 drop-shadow-lg text-sm rounded-md h-8 font-inter justify-center ${
            trained
              ? "bg-bpegreen hover:bg-green-500"
              : "bg-gray-300 cursor-not-allowed"
          }`} // Disable button if model is not trained
          onClick={handleTestClick}
          disabled={!trained} // Disable the button if the model is not trained
        >
          Test
        </button>
        <button
          className="flex items-center w-20 bg-gray-300 h-8 drop-shadow-lg text-sm rounded-md font-inter justify-center hover:bg-gray-400"
          onClick={handleDeleteClick} // Trigger delete function
          disabled={!trained} // Disable the button if the model is not trained
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TrainedModelItem;
