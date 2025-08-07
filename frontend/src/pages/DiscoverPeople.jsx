import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { useNavigate } from "react-router-dom";
import NavBar, { MobileLogoTop, MobileNavBar } from "../components/NavBar";
import api from "../utils/axios-api.js";
import { Search } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const DiscoverPeople = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(AppContext);
  const [users, setUsers] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const handleInput = (event) => {
    setInputValue(event.target.value);
    if (event.target.value === "" && isSearching) {
      // Auto-switch back to discover list when user clears search
      getUsers();
    }
  };

  const handleSearchClick = async () => {
    const response = await api.post(
      "/users/search",
      { inputValue },
      {
        withCredentials: true,
      }
    );

    if (response.data.data.users.length === 0) {
      showToast({
        message: "404 no user found",
        type: "error",
      });
    } else {
      setUsers(response.data.data.users);
      setIsSearching(true);
    }
  };
  const getUsers = async () => {
    try {
      const response = await api.get("/users/discover");
      setUsers(response.data.data.users);
      setIsSearching(false);
    } catch (error) {
      console.error("error fetching users", error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  if (!users) {
    return (
      <div className="relative mt-[70px] w-screen h-screen">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <NavBar />
      <MobileNavBar />
      <MobileLogoTop />

      <div className="flex flex-col gap-1 md:gap-2 bg-[rgb(16,16,16)] mt-[50px] md:mt-[70px] mb-[5px] p-2 md:p-5 rounded-md w-[97%] md:w-[600px] h-full md:min-h-[700px]">
        <div className="flex justify-between items-center mb-5 w-full">
          <input
            value={inputValue}
            placeholder="Search people"
            onChange={handleInput}
            type="text"
            className="bg-transparent px-5 border border-white border-solid rounded-full w-[90%] h-[40px] md:h-[50px] text-white"
          />
          <Search
            color="white"
            size={window.innerWidth >= 768 ? 32 : 24}
            onClick={() => handleSearchClick()}
            className="cursor-pointer"
          />
        </div>

        {users &&
          users.map((user, index) => {
            return <UserCard key={user._id} user={user} />;
          })}
      </div>
    </div>
  );
};

export default DiscoverPeople;
