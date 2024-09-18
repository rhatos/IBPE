import { useEffect, useState } from "react";
import Modal from "../modals/modal.tsx";
import { AppDispatch, RootState } from "../../store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedIn } from "../../slices/authSlice.ts";
import { setRegModalOpen, setLogInModalOpen } from "../../slices/modalSlice.ts";

/**
 * The `LogInButton` component is a React functional component that renders a login button and a modal for the login form.
 *
 * The component uses Redux to manage the state of the login modal and the user's authentication status. It also handles the login process, including making an API call to the backend and updating the Redux state accordingly.
 * The component renders a button that opens the login modal when clicked. The modal contains input fields for the username and password, as well as a login button and a link to the registration modal.
 * The component also includes various state variables and functions to manage the form state, handle errors, and reset the form when necessary.
 */
const LogInButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Getting the dispatch function from Redux
  const isModalOpen = useSelector(
    (state: RootState) => state.logInModal.isModalOpen
  ); // Selecting whether the login modal is open from Redux state

  // Local state for the component
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  // Function to reset the form fields and modal state
  const resetFormState = () => {
    dispatch(setLogInModalOpen(false)); // Close the login modal
    setUsername("");
    setPassword("");
    setErrMessage(null);
    setIsButtonDisabled(true);
  };

  // useEffect to monitor changes in the username and password fields
  useEffect(() => {
    if (password && username) {
      setErrMessage(null); // Clear error if both fields are filled
      setIsButtonDisabled(false); // Enable login button when both fields have values
    } else {
      setIsButtonDisabled(true); // Disable login button if any field is empty
    }
  }, [username, password]); // Run the effect whenever username or password changes

  // Function to handle the login process when the login button is clicked
  const handleLoginClick = async () => {
    if (isButtonDisabled) return; // If the button is disabled, don't proceed with login
    console.log(apiUrl);
    try {
      // API call to log in the user
      const response = await fetch(`${apiUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrMessage(data.error); // Show error message if login fails
        setIsButtonDisabled(true); // Disable the button after an error
        return;
      }

      // On successful login, update Redux state with user information and JWT token
      dispatch(
        setLoggedIn({ loggedIn: true, username, token: data.access_token })
      );
      dispatch(setLogInModalOpen(false)); // Close the login modal
      resetFormState(); // Reset the form state after successful login
    } catch (error) {
      // Handle any errors during the login process
      setErrMessage(
        "Something went wrong, please contact support if this persists"
      ); // Show a generic error message
      setIsButtonDisabled(true); // Disable the login button in case of error
    }
  };

  // Function to switch from login modal to registration modal
  const handleSignUpClick = () => {
    dispatch(setLogInModalOpen(false)); // Close login modal
    dispatch(setRegModalOpen(true)); // Open registration modal
    resetFormState(); // Reset the form state when switching
  };

  return (
    <>
      {/* Button to open the login modal */}
      <button
        onClick={() => dispatch(setLogInModalOpen(true))}
        className="bg-gray-300 hover:bg-gray-400 text-black w-20 text-center h-8 drop-shadow-xl rounded-lg flex items-center justify-center font-inter cursor-pointer"
      >
        <p className="text-sm">Log in</p>
      </button>

      {/* Modal component to display the login form */}
      <Modal isOpen={isModalOpen} onClose={() => resetFormState()}> 
        {/* Modal is controlled by the isModalOpen state */}
        <h2 className="text-bpegreen text-lg font-semibold mb-4">Login</h2>
        {/* Display error message if there's any */}
        {errMessage && (
          <div className="mb-4 text-red-500 font-semibold">{errMessage}</div>
        )}
        {/* Username input field */}
        <div className="mb-4">
          <label className="block text-white">Username</label>
          <input
            type="text"
            value={username} // Controlled input for the username field
            onChange={(e) => setUsername(e.target.value)} // Update username state on input change
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        {/* Password input field */}
        <div className="mb-6">
          <label className="block text-white">Password</label>
          <input
            type="password"
            value={password} // Controlled input for the password field
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            className="w-full p-2 border border-gray-300 rounded mt-1 "
          />
        </div>
        {/* Button and link section */}
        <div className="space-y-6">
          {/* Login button */}
          <button
            onClick={handleLoginClick} // Trigger the login process on click
            className={`bg-bpegreen hover:bg-green-500 text-black w-28 text-center h-10 drop-shadow-xl rounded-lg flex items-center justify-center font-inter ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`} // Button styles change based on whether it's disabled
            disabled={isButtonDisabled}
          >
            {/* Button disabled based on state */}
            Login
          </button>

          {/* Link to sign up */}
          <p
            onClick={handleSignUpClick} // Switch to the registration modal on click
            className="text-sm text-white font-bold w-90 text-left h-10 flex items-center cursor-pointer hover:text-bpegreen font-inter"
          >
            Don't have an account? Sign Up Now!
          </p>
        </div>
      </Modal>
    </>
  );
};

export default LogInButton;
