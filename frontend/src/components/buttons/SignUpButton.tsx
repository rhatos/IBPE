import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import Modal from "../modals/modal";
import { setLoggedIn } from "../../slices/authSlice";
import { setLogInModalOpen, setRegModalOpen } from "../../slices/modalSlice";

const SignUpButton: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.registerModal.isModalOpen);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const resetFormState = () => {
    dispatch(setRegModalOpen(false))
    setUsername('');
    setPassword('');
    setEmail('');
    setConfirm('');
    setErrMessage(null);
    setIsButtonDisabled(true);
  };

  useEffect(() => {
    const isEmailValid = email.includes('@');

    if (!isEmailValid && email) {
      setErrMessage("Invalid email format");
      setIsButtonDisabled(true);
    } else if (password && confirm && password !== confirm) {
      setErrMessage("Passwords do not match");
      setIsButtonDisabled(true);
    } else if (username && password && email && confirm && password === confirm) {
      setErrMessage(null);
      setIsButtonDisabled(false);
    } else {
      setErrMessage(null)
      setIsButtonDisabled(true);
    }
  }, [username, password, email, confirm]);

  const handleSignUpClick = async () => {
    if (isButtonDisabled) return;
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrMessage(data.error);
        setIsButtonDisabled(true);
        return;
      }
      
      dispatch(setLoggedIn({ loggedIn: true, username, token: data.access_token }));
      dispatch(setRegModalOpen(false));
      resetFormState();
  
    } catch (error) {
      setErrMessage("Something went wrong, please contact support if this persists");
      setIsButtonDisabled(true);
    }

  };

  const handleLogInClick = () => {
    dispatch(setRegModalOpen(false))
    dispatch(setLogInModalOpen(true));
    resetFormState();
  };

  return (
    <>
      <button
        onClick={() => dispatch(setRegModalOpen(true))}
        className="bg-bpegreen hover:bg-green-600 text-black w-20 text-center h-8 drop-shadow-xl rounded-lg flex items-center justify-center font-inter cursor-pointer"
      >
        <p className="text-sm">Sign Up</p>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => resetFormState()}>
        <h2 className="text-bpegreen text-lg font-semibold mb-4">Sign Up</h2>

        {errMessage && (
        <div className="mb-4 text-red-500 font-semibold">
          {errMessage}
        </div>
        )}

        <div className="mb-4">
          <label className="block text-white">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>

        <div className="mb-4">
          <label className="block text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>
        
        <div className="mb-4">
          <label className="block text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>

        <div className="mb-6">
          <label className="block text-white">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 "/>
        </div>

        <div className="space-y-6"> 
          <button
            onClick={handleSignUpClick}
            className={`bg-bpegreen hover:bg-green-500 text-black w-28 text-center h-10 drop-shadow-xl rounded-lg flex items-center justify-center font-inter ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isButtonDisabled}>
            Sign Up
          </button>
          
          <p
            onClick={handleLogInClick}
            className="text-sm text-white font-bold w-90 text-left h-10 flex items-center cursor-pointer  hover:text-bpegreen font-inter">
            Already have an account? Log In!
          </p>
        </div>
      </Modal>
    </>
  );
};
export default SignUpButton;
