import LogInButton from "./buttons/LoginButton";
import SignUpButton from "./buttons/SignUpButton";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/store';
import UserButton from "./buttons/UserButton";

const Navbar: React.FC = () => {

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  return (
    
    <div className="bg-bpeblack rounded-b-sm w-full mx-auto mb-8">
      <div className="flex justify-between items-center p-3">
        <div className="flex space-x-4 items-center">
          <Link to="/home">
            <p className="text-xl text-white font-medium font-inter">
              Interactive <span className="text-bpegreen"> BPE</span> Tool
            </p>
          </Link>
        </div>

        <div className="flex space-x-4 items-center">
          {loggedIn ? (
            <div className="flex space-x-5 items-center pr-3">

              <Link to="/user/model/tokenize">
                <p className="text-gray-200 hover:text-white font-medium font-inter text-sm">
                  Test Model
                </p>
              </Link>

              <Link to="/train">
                <p className="text-gray-200 hover:text-white font-medium font-inter text-sm">
                  Train Model
                </p>
              </Link>
              
              <Link to="/user/models">
                <p className="text-gray-200 hover:text-white font-medium font-inter text-sm">
                  Models
                </p>
              </Link>

              <UserButton />
            </div>
          ):(
            <div className="flex space-x-2 items-center">
              <LogInButton />
              <SignUpButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
