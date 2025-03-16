import React from "react";
import LogOut from "./LogOut";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate()
  return (
    <div className="bg-black w-full h-16">
      <LogOut />
      <button
        type="button"
        onClick={() => navigate('/discover-people') }
        className="bg-white p-5"
      >
        Discover People
      </button>
    </div>
  );
};

export default NavBar;
