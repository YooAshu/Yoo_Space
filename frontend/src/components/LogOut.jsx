import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SoketContext.jsx";
import { AppContext } from "../context/AppContext.jsx";
import api from "../utils/axios-api.js";

const LogOut = () => {
  const { setCurrentUserByToken } = useContext(AppContext);
  const navigate = useNavigate();
  const { socket, setSocket } = useSocket();
  const handleOnclick = async () => {
    try {
      const response = await api.post(
        "/users/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status == 200) {
        // localStorage.removeItem("userId");
        navigate("/login");
        setCurrentUserByToken(null);
      }
      if (socket) {
        socket.disconnect();
        //console.log("🔌 Socket manually disconnected");
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
      className="flex justify-center items-center bg-white my-2 ml-2 px-5 rounded-full font-bold text-black"
    >
      Logout
    </button>
  );
};

export default LogOut;
