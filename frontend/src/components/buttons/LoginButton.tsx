import { useState } from 'react';
import Modal from '../modals/modal.tsx';
import { AppDispatch, RootState } from '../../store/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn } from '../../slices/authSlice.ts';
import { setRegModalOpen, setLogInModalOpen} from '../../slices/modalSlice.ts';


const LogInButton: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.logInModal.isModalOpen);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    dispatch(setLoggedIn(true));
    dispatch(setLogInModalOpen(false));
  };  

  const handleSignUpClick = () => {
    dispatch(setLogInModalOpen(false));
    dispatch(setRegModalOpen(true));
  };

  return (
    <>
      <button
        onClick={() => dispatch(setLogInModalOpen(true))} 
        className="bg-gray-300 hover:bg-gray-400 text-black w-20 text-center h-8 drop-shadow-xl rounded-lg flex items-center justify-center font-inter cursor-pointer"
      >
        <p className="text-sm">Log in</p>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => dispatch(setLogInModalOpen(false))}>
        <h2 className="text-bpegreen text-lg font-semibold mb-4">Login</h2>

        <div className="mb-4">
          <label className="block text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"/>
        </div>

        <div className="mb-6">
          <label className="block text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 "/>
        </div>

        <div className="space-y-6"> 
          <button
            onClick={handleLoginClick}
            className="bg-bpegreen hover:bg-green-500 text-black w-28 text-center h-10 drop-shadow-xl rounded-lg flex items-center justify-center font-inter">
            Login
          </button>
          
          <p
            onClick={handleSignUpClick}
            className="text-sm text-white font-bold w-90 text-left h-10 flex items-center cursor-pointer  hover:text-bpegreen font-inter">
            Don't have an account? Sign Up Now!
          </p>
        </div>
      </Modal>
    </>
  );
};

export default LogInButton;
