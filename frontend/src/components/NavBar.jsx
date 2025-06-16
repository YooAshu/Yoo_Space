import LogOut from "./LogOut";
import { useNavigate, useLocation } from "react-router-dom";
import YooSpace from "../assets/yoospace.png";
import {
  House,
  MessageSquareDot,
  UserRound,
  UserRoundSearch,
  Users,
} from "lucide-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hidden top-[10px] md:flex justify-end bg-black pr-3 w-[50%] h-[50px] text-[16px] navbar-glass">
      <div className="flex items-center ml-4 w-[20%] h-full">
        <img src={YooSpace} alt="yoohub" onClick={() => navigate("/")} />
      </div>
      <div className="flex justify-end items-center gap-[3%] w-[80%] h-full">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`flex justify-center items-center my-2 py-1 px-3 rounded-full font-bold ${
            isActive("/") ? "bg-white text-black" : "text-white"
          }`}
        >
          Feed
        </button>

        <button
          type="button"
          onClick={() => navigate("/discover-people")}
          className={` my-2 px-3 flex justify-center items-center py-1 rounded-full font-bold ${
            isActive("/discover-people") ? "bg-white text-black" : "text-white"
          }`}
        >
          Discover People
        </button>

        <button
          type="button"
          onClick={() => navigate("/all-chats")}
          className={`flex justify-center items-center my-2 py-1 px-3 rounded-full font-bold ${
            isActive("/all-chats") ? "bg-white text-black" : "text-white"
          }`}
        >
          Chats
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className={`flex justify-center items-center my-2 py-1 px-3 rounded-full font-bold ${
            isActive("/profile") ? "bg-white text-black" : "text-white"
          }`}
        >
          Profile
        </button>

        <LogOut />
      </div>
    </div>
  );
};

const MobileNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <div className="md:hidden bottom-[10px] flex justify-around bg-black pr-3 w-[90%] h-[50px] text-[8px] navbar-glass">
      <button
        type="button"
        onClick={() => navigate("/")}
        className={`flex justify-center items-center my-2  px-2 rounded-full font-bold ${
          isActive("/") ? "bg-white text-black" : "text-white"
        }`}
      >
        <House />
      </button>

      <button
        type="button"
        onClick={() => navigate("/discover-people")}
        className={` my-2  px-2 flex justify-center items-center  rounded-full font-bold ${
          isActive("/discover-people") ? "bg-white text-black" : "text-white"
        }`}
      >
        <UserRoundSearch />
      </button>

      <button
        type="button"
        onClick={() => navigate("/all-chats")}
        className={`flex justify-center items-center my-2  px-2 rounded-full font-bold ${
          isActive("/all-chats") ? "bg-white text-black" : "text-white"
        }`}
      >
        <MessageSquareDot />
      </button>

      <button
        type="button"
        onClick={() => navigate("/profile")}
        className={`flex justify-center items-center my-2  px-2 rounded-full font-bold ${
          isActive("/profile") ? "bg-white text-black" : "text-white"
        }`}
      >
        <UserRound />
      </button>
    </div>
  );
};

const MobileLogoTop = () => {
  const navigate = useNavigate();
  return (
    <div className="md:hidden top-0 left-1/2 absolute flex justify-between items-center bg-black px-[5%] w-full h-[50px] text-[8px] -translate-x-1/2 transform">
      <div className="left-4 flex items-center w-[30%] h-[50px]">
        <img src={YooSpace} alt="yoohub" onClick={() => navigate("/")} />
      </div>
      <LogOut />
    </div>
  );
};

export { MobileNavBar, MobileLogoTop };
export default NavBar;
