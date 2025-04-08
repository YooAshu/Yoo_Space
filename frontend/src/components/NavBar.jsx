import React from "react";
import LogOut from "./LogOut";
import { useNavigate, useLocation } from "react-router-dom";
import YooSpace from "../assets/yoospace.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative flex justify-end bg-black w-full h-[50px]">
      <div className="left-4 absolute flex items-center w-[10%] h-full">
        <img src={YooSpace} alt="yoohub" />
      </div>
      <button
        type="button"
        onClick={() => navigate("/")}
        className={`flex justify-center items-center my-2 px-5 rounded-full font-bold ${
          isActive("/") ? "bg-white text-black" : "text-white"
        }`}
      >
        Feed
      </button>

      <button
        type="button"
        onClick={() => navigate("/discover-people")}
        className={` my-2 px-5 flex justify-center items-center  rounded-full font-bold ${
          isActive("/discover-people") ? "bg-white text-black" : "text-white"
        }`}
      >
        Discover People
      </button>
      <button
        type="button"
        onClick={() => navigate("/profile")}
        className={`flex justify-center items-center my-2 px-5 rounded-full font-bold ${
          isActive("/profile") ? "bg-white text-black" : "text-white"
        }`}
      >
        Profile
      </button>

      <button
        type="button"
        onClick={() => navigate("/all-chats")}
        className={`flex justify-center items-center my-2 px-5 rounded-full font-bold ${
          isActive("/all-chats") ? "bg-white text-black" : "text-white"
        }`}
      >
        Chats
      </button>

      <button
        type="button"
        onClick={() => navigate("/profile/update")}
        className={`flex justify-center items-center my-2 px-5 rounded-full font-bold ${
          isActive("/profile/update") ? "bg-white text-black" : "text-white"
        }`}
      >
        Update Profile
      </button>
      <LogOut />
    </div>
  );
};

export default NavBar;
