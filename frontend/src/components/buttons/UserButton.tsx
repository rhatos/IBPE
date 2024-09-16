import { useDispatch, useSelector } from "react-redux";
import UserSVG from "../../assets/svgs/UserSVG";
import { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UserButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const { username } = useSelector((state: RootState) => state.auth); // Get the logged-in username from Redux store
  const [dropdownOpen, setDropdownOpen] = useState(false); // Local state to manage dropdown visibility

  // Handles the logout action and redirects to home page
  const handleLogout = () => {
    dispatch(logout()); // Dispatches the logout action to update auth state
    navigate('/home'); // Redirect to home after logging out
  };

  // Handles navigating to the change password page (currently navigates to home)
  const handleChangePassword = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the dropdown visibility
    navigate('/home'); // Redirect to change password page (should be replaced with the actual route)
  };

  return (
    <div className="relative inline-block text-left">
      {/* Button that toggles the dropdown */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown state on click
        className="pl-2 text-gray-200 hover:text-white flex items-center font-medium font-inter text-xs cursor-pointer"
      >
        <UserSVG /> {/* Display user icon */}
        <span className="ml-1">{username}</span> {/* Show username */}
      </button>

      {/* Dropdown menu, displayed conditionally */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
          <div className="py-1">
            {/* Button for changing password (currently redirects to home) */}
            <button
              onClick={handleChangePassword}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Change Password
            </button>
            {/* Logout button */}
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
