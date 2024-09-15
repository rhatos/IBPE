import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TrainedModelItemProps {
  _id: string | null;
  name: string;
  subword_vocab_count: number;
  trained: boolean;
  onDelete: () => void;
}

const formatVocabularyCount = (count: number) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return count.toString();
};



const TrainedModelItem =({ name, subword_vocab_count, _id, trained, onDelete }: TrainedModelItemProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  
  const handleDeleteClick = async () => {
    try {
  
      const token = localStorage.getItem('token');
  
      const requestData = {
        tokenizer_id: _id
      };
      
      const response = await fetch('http://127.0.0.1:5000/api/tokenizer/delete', {
        method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.log('Failed to delete model:', data.error);
        return;
      }else{
        onDelete();
        console.log('Model deleted successfully:', data);
      }
      
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  
  };

  const handleTestClick = () => {
    navigate("/user/model/tokenize", { state: { modelId: _id, name: name } });
  };

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://127.0.0.1:5000/api/tokenizer/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ tokenizer_id: _id, tokenizer_new_name: newName }),
        });

        const data = await response.json();

        if (response.ok) {
          setIsEditing(false);
          window.location.reload();
        } else {
          console.log('Failed to update model:', data.error);
          window.location.reload();
        }
      } catch (error) {
        console.error('Error during update:', error);
        window.location.reload();
      }
    } else {
      setIsEditing(!isEditing);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
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
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="text-white font-inter text-xl bg-bpelightgrey border-b border-white"
            />
          ) : (
            <>
              <h1 className="text-white font-inter text-xl">
                {name} {!trained && <span className="text-red-500">(Training)</span>}
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
          <span className="text-bpegreen font-inter text-sm">{formatVocabularyCount(subword_vocab_count)}</span>
          <span className="text-white font-inter text-xs">(Tokens)</span>
        </div>
      </div>
      <div className="flex flex-col text-black items-center justify-center p-4 space-y-2">
        <button
          className={`flex items-center w-20 drop-shadow-lg text-sm rounded-md h-8 font-inter justify-center ${
            trained ? 'bg-bpegreen hover:bg-green-500' : 'bg-gray-300 cursor-not-allowed'
          }`}
          onClick={handleTestClick}
          disabled={!trained}
        >
          Test
        </button>
        <button
          className="flex items-center w-20 bg-gray-300 h-8 drop-shadow-lg text-sm rounded-md font-inter justify-center hover:bg-gray-400"
          onClick={handleDeleteClick}
          disabled={!trained}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default TrainedModelItem;
