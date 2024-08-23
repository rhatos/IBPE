import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { useState } from "react";
import Modal from "../modals/modal";
import { setLoggedIn } from "../../slices/authSlice";
import { setLogInModalOpen, setRegModalOpen } from "../../slices/modalSlice";

const RegisterButton: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.registerModal.isModalOpen);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirm, setConfrim] = useState('');


  const handleLoginClick = () => {
    dispatch(setLoggedIn(true));
    dispatch(setRegModalOpen(false))

  };

  const handleLogInClick = () => {
    dispatch(setRegModalOpen(false))
    dispatch(setLogInModalOpen(true));
  };

  return (
    <>
      <div
        onClick={() => dispatch(setRegModalOpen(true))}
        className="bg-bpegreen hover:bg-green-600 text-black w-20 text-center h-8 drop-shadow-xl
     rounded-lg space-x-4 flex items-center justify-center font-inter cursor-pointer"
      >
        <p className="text-sm">Sign Up</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => dispatch(setRegModalOpen(false))}>
        <h2 className="text-bpegreen text-lg font-semibold mb-4">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-white">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div><div className="mb-4">
          <label className="block text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-6">
          <label className="block text-white">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfrim(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 "
          />
        </div>
        <div className="space-y-6"> 
          <button
            onClick={handleLoginClick}
            className="bg-bpegreen hover:bg-green-500 text-black w-28 text-center h-10 drop-shadow-xl rounded-lg flex items-center justify-center font-inter"
          >
            Sign Up
          </button>
          
          <p
            onClick={handleLogInClick}
            className="text-sm text-white font-bold w-90 text-left h-10 flex items-center cursor-pointer  hover:text-bpegreen font-inter"
          >
            Already have an account? Log In!
          </p>
        </div>
      </Modal>
    </>
  );
};
export default RegisterButton;
