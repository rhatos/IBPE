import { useState, useEffect } from "react";
import OpenArrow from "../../assets/svgs/OpenArrow";

interface SelectTokenizerProps {
  isTokenizerSelected: boolean;
  tokenizerIsSelected: (selected: boolean, tokenizer_id: string | null) => void;
  modelsPageModelId?: string | undefined;
  modelsPageName?: string | undefined;
}

interface Model {
  _id: string | null;
  name: string;
  subword_vocab_count: number;
  trained: boolean;
}

const SelectTokenizer: React.FC<SelectTokenizerProps> = ({
  isTokenizerSelected,
  tokenizerIsSelected,
  modelsPageModelId,
  modelsPageName,
}) => {
  const [tokenizerDrawerOpen, setTokenizerDrawerOpen] = useState(false);
  const [tokenizerName, setTokenizerName] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);

  const checkPreviousSelection = () => {
    if (modelsPageModelId && modelsPageName) {
      setTokenizerName(modelsPageName);
      tokenizerIsSelected(!!modelsPageModelId, modelsPageModelId);
    }
  }

  useEffect(() => {
    checkPreviousSelection();
  }, [modelsPageModelId, modelsPageName]);

  useEffect(() => {
    if (tokenizerDrawerOpen) {
      const fetchModels = async () => {
        setLoading(true);
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
        setLoading(false);
      };

      fetchModels();
    }
  }, [tokenizerDrawerOpen]);

  const formatVocabularyCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return count.toString();
  };

  const handleTokenizerSelect = (name: string, _id: string | null) => {
    setTokenizerName(name);
    setTokenizerDrawerOpen(false);
    tokenizerIsSelected(!!_id, _id);
  };

  return (
    <div className="flex flex-col">
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
      {tokenizerDrawerOpen && (
        <div>
          {loading ? (
            <p className="text-white font-inter text-sm">Loading models...</p>
          ) : (
            models.length > 0 ? (
              models
                .filter(model => model.name !== tokenizerName && model.trained)
                .map((model) => (
                  <li
                    key={model._id}
                    onClick={() => handleTokenizerSelect(model.name, model._id)}
                    className="flex flex-row h-12 border-b-2 border-white border-opacity-20 justify-between items-center bg-bpeblack hover:bg-bpelightgrey"
                  >
                    <div className="text-white font-inter text-sm pl-2">
                      {model.name}
                    </div>
                    <div className="text-bpegreen font-inter text-xs pr-2">
                      {formatVocabularyCount(model.subword_vocab_count)} Vocabulary
                    </div>
                  </li>
                ))
            ) : (
              <p className="text-white font-inter text-sm">No models found</p>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SelectTokenizer;
