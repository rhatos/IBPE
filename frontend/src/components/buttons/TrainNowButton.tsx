import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store/store";

/**
 * A React component that renders a "Train Now" button that links to the training page if the user is logged in, or a "Use Default" button that links to a default model/tokenizer page if the user is not logged in.
 * The component uses the `useSelector` hook from `react-redux` to check the login status of the user from the Redux store.
 * @returns A React element that renders the appropriate button based on the user's login status.
 */
const TrainNowButton = () => {
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn); // Check if user is logged in from Redux state

  return (
    <div>
      {loggedIn ? (
        // Show "Train Now" button if the user is logged in, linking to the training page
        <Link to="/train">
          <button className="bg-bpegreen hover:bg-green-500 text-black w-36 h-12 shadow-lg drop-shadow-lg rounded-xl flex items-center justify-between p-4 font-inter">
            <p className="text-sm">Train now!</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </Link>
      ) : (
        // Show "Use Default" button if the user is not logged in, linking to a default model/tokenizer page
        <Link to="/user/model/tokenize">
          <button className="bg-bpegreen hover:bg-green-500 text-black w-36 h-12 shadow-lg drop-shadow-lg rounded-xl flex items-center justify-between p-4 font-inter">
            <p className="text-sm">Use Default</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </Link>
      )}
    </div>
  );
};

export default TrainNowButton;
