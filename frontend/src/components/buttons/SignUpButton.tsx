import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import Modal from "../modals/modal";
import { setLoggedIn } from "../../slices/authSlice";
import { setLogInModalOpen, setRegModalOpen } from "../../slices/modalSlice";

/**
 * A React functional component that renders a sign-up button and a modal for the sign-up form.
 *
 * The component uses Redux hooks to dispatch actions and access the state of the application.
 * It manages the state of the sign-up form, including the username, password, email, and confirmation password.
 * It also handles the sign-up process, including validating the form inputs and making a POST request to the server.
 * If the sign-up is successful, the component dispatches actions to update the authentication state and close the sign-up modal.
 * If there is an error, the component displays an error message.
 * The component also provides a link to the login modal.
 */
const SignUpButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const isModalOpen = useSelector(
    (state: RootState) => state.registerModal.isModalOpen
  ); // Selecting whether the registration modal is open from Redux state

  // Local component state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // State to disable or enable the sign-up button

  // Backend url env value
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

  // Function to reset form fields and modal state
  const resetFormState = () => {
    dispatch(setRegModalOpen(false)); // Close the registration modal
    setUsername("");
    setPassword("");
    setEmail("");
    setConfirm("");
    setErrMessage(null);
    setIsButtonDisabled(true);
  };

  // useEffect to validate form input and enable/disable the sign-up button accordingly
  useEffect(() => {
    const isEmailValid = email.includes("@"); // Simple validation to check if email contains an '@'

    if (!isEmailValid && email) {
      setErrMessage("Invalid email format"); // Set error message for invalid email
      setIsButtonDisabled(true); // Disable the button if email format is incorrect
    } else if (password && confirm && password !== confirm) {
      setErrMessage("Passwords do not match"); // Set error message if passwords don't match
      setIsButtonDisabled(true); // Disable the button if passwords don't match
    } else if (
      username &&
      password &&
      email &&
      confirm &&
      password === confirm
    ) {
      setErrMessage(null); // Clear error message if all fields are valid
      setIsButtonDisabled(false); // Enable the button when all fields are valid
    } else {
      setErrMessage(null); // Clear error messages for other conditions
      setIsButtonDisabled(true); // Disable the button if all required fields aren't filled
    }
  }, [username, password, email, confirm]); // Run effect whenever any of the form fields change

  // Function to handle the sign-up button click
  const handleSignUpClick = async () => {
    if (isButtonDisabled) return;

    try {
      // API call to register a new user
      const response = await fetch(`${apiUrl}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrMessage(data.error); // Show error message if registration fails
        setIsButtonDisabled(true); // Disable the button if there's an error
        return;
      }

      // On successful sign-up, log the user in and close the modal
      dispatch(
        setLoggedIn({ loggedIn: true, username, token: data.access_token })
      );
      dispatch(setRegModalOpen(false)); // Close the registration modal
      resetFormState(); // Reset the form fields and modal state
    } catch (error) {
      // Handle any errors during the sign-up process
      setErrMessage(
        "Something went wrong, please contact support if this persists"
      ); // Show a generic error message
      setIsButtonDisabled(true); // Disable the button if there's an error
    }
  };

  // Function to handle switching to the login modal
  const handleLogInClick = () => {
    dispatch(setRegModalOpen(false)); // Close registration modal
    dispatch(setLogInModalOpen(true)); // Open login modal
    resetFormState(); // Reset the form state
  };

  return (
    <>
      {/* Button to open the sign-up modal */}
      <button
        onClick={() => dispatch(setRegModalOpen(true))} // Opens the sign-up modal on click
        className="bg-bpegreen hover:bg-green-600 text-black w-20 text-center h-8 drop-shadow-xl rounded-lg flex items-center justify-center font-inter cursor-pointer"
      >
        <p className="text-sm">Sign Up</p>
      </button>

      {/* Modal component for sign-up form */}
      <Modal isOpen={isModalOpen} onClose={() => resetFormState()}>
        {/* Modal is controlled by the isModalOpen state */}
        <h2 className="text-bpegreen text-lg font-semibold mb-4">Sign Up</h2>
        {/* Display error message if any */}
        {errMessage && (
          <div className="mb-4 text-red-500 font-semibold">{errMessage}</div>
        )}
        {/* Email input field */}
        <div className="mb-4">
          <label className="block text-white">Email</label>
          <input
            type="text"
            value={email} // Controlled input for the email field
            onChange={(e) => setEmail(e.target.value)} // Update email state on input change
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
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
        <div className="mb-4">
          <label className="block text-white">Password</label>
          <input
            type="password"
            value={password} // Controlled input for the password field
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        {/* Confirm password input field */}
        <div className="mb-6">
          <label className="block text-white">Confirm Password</label>
          <input
            type="password"
            value={confirm} // Controlled input for the confirm password field
            onChange={(e) => setConfirm(e.target.value)} // Update confirm password state on input change
            className="w-full p-2 border border-gray-300 rounded mt-1 "
          />
        </div>
        {/* Button and link section */}
        <div className="space-y-6">
          {/* Sign-up button */}
          <button
            onClick={handleSignUpClick} // Trigger the sign-up process on click
            className={`bg-bpegreen hover:bg-green-500 text-black w-28 text-center h-10 drop-shadow-xl rounded-lg flex items-center justify-center font-inter ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`} // Button styles change based on whether it's disabled
            disabled={isButtonDisabled}
          >
            {/* Button disabled based on state */}
            Sign Up
          </button>

          {/* Link to log in */}
          <p
            onClick={handleLogInClick} // Switch to the login modal on click
            className="text-sm text-white font-bold w-90 text-left h-10 flex items-center cursor-pointer  hover:text-bpegreen font-inter"
          >
            Already have an account? Log In!
          </p>
        </div>
      </Modal>
    </>
  );
};
export default SignUpButton;
