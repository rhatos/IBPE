
import { useDispatch } from "react-redux";
import UserSVG from "../../assets/svgs/UserSVG";
import { AppDispatch } from "../../store/store";
import { setLoggedIn } from "../../slices/authSlice";


const UserButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setLoggedIn(false));
  };
  return (
    <div
      onClick={handleLogout}
      className="pl-2 text-gray-200 hover:text-white flex items-center font-medium font-inter text-xs cursor-pointer"
    >
      <UserSVG />
      User
    </div>
  );
};

export default UserButton;
