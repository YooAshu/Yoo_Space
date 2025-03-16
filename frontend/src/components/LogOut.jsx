import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
  const navigate = useNavigate();
  const handleOnclick = async () => {
    try {
        const response = await axios.post("/api/users/logout", {}, {
            withCredentials: true
        });
        
      if (response.status == 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleOnclick()}
      className="bg-white p-5"
    >
      Logout
    </button>
  );
};

export default LogOut;
