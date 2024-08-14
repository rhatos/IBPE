import React, { useState } from "react";
import LoginButton from "./buttons/LoginButton";
import RegisterButton from "./buttons/RegisterButton";
import { Link } from "react-router-dom";
import UserButton from "./buttons/UserButton";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  return (
    <div className="bg-bpeblack rounded-b-sm w-full mx-auto mb-8">
      <div className="flex justify-between items-center p-3">
        <div className="flex space-x-4 items-center">
          <Link to="/">
            <p className="text-xl text-white font-medium font-inter">
              Interactive <span className="text-bpegreen"> BPE</span> Tool
            </p>
          </Link>
        </div>

        <div className="flex space-x-4 items-center">
          {loggedIn && (
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
          )}

          {!loggedIn && (
            <div className="flex space-x-2 items-center">
              <LoginButton />
              <RegisterButton />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
