import React from "react";
import LogOut from "./LogOut";
import { useNavigate } from "react-router-dom";
import YooHub from "../assets/yoohub.png";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="relative flex justify-end bg-black w-full h-16">
      <div className="left-4 absolute flex items-center w-[10%] h-full">
        <img src={YooHub} alt="yoohub" />
      </div>
      <button
        type="button"
        onClick={() => navigate("/")}
        className="bg-white p-5"
      >
        Feed
      </button>

      <button
        type="button"
        onClick={() => navigate("/discover-people")}
        className="bg-white p-5"
      >
        Discover People
      </button>
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className="bg-white p-5"
      >
        Profile
      </button>
      <button
        type="button"
        onClick={() => navigate("/profile/update")}
        className="bg-white p-5"
      >
        Update Profile
      </button>
      <LogOut />
    </div>
  );
};

export default NavBar;
