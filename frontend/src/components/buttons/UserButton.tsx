import { useDispatch, useSelector } from "react-redux";
import UserSVG from "../../assets/svgs/UserSVG";
import { AppDispatch, RootState } from "../../store/store";
import { logout} from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const UserButton: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { username} = useSelector((state: RootState) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  const handleChangePassword = () => {
    setDropdownOpen(!dropdownOpen)
    navigate('/home'); // Change this path to your change password page
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="pl-2 text-gray-200 hover:text-white flex items-center font-medium font-inter text-xs cursor-pointer"
      >
        <UserSVG />
        <span className="ml-1">{username}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <div className="py-1">
            <button
              onClick={handleChangePassword}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserButton;
