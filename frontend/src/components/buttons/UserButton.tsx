import { useDispatch } from "react-redux";
import UserSVG from "../../assets/svgs/UserSVG";
import { AppDispatch } from "../../store/store";
import { setLoggedIn } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";


const UserButton: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setLoggedIn(false));
    navigate('/home');
  };

  return (
    <button
      onClick={handleLogout}
      className="pl-2 text-gray-200 hover:text-white flex items-center font-medium font-inter text-xs cursor-pointer"
    >
      <UserSVG />
      <span className="ml-1">User</span>
    </button>
  );
};

export default UserButton;
