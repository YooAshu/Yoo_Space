import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SoketContext.jsx";

const LogOut = () => {
  const navigate = useNavigate();
  const { socket, setSocket } = useSocket();
  const handleOnclick = async () => {
    try {
      const response = await axios.post(
        "/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        localStorage.removeItem("userId");
        navigate("/login");
      }
      if (socket) {
        socket.disconnect();
        console.log("🔌 Socket manually disconnected");
        // setSocket(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleOnclick()}
      className="flex justify-center items-center bg-white my-2 px-5 rounded-full font-bold text-black"
    >
      Logout
    </button>
  );
};

export default LogOut;
