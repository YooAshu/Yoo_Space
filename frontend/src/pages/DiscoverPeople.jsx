import { useEffect, useState } from "react";
import UserCard from "../components/UserCard";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import api from "../utils/axios-api.js";
import { Search } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

const DiscoverPeople = () => {
  const navigate = useNavigate();
  const { showToast } = useContext(AppContext);
  const [users, setUsers] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearchClick = async () => {
    const response = await api.post(
      "/users/search",
      { inputValue },
      {
        withCredentials: true,
      }
    );

    //console.log(response.data.data);
    if (response.data.data.users.length === 0) {
      showToast({
        message: "404 no user found",
        type: "error",
      });
    } else {
      setUsers(response.data.data.users);
    }
  };
  const getUsers = async () => {
    try {
      const response = await api.get("/users/discover");
      setUsers(response.data.data.users);
      // //console.log(response.data.data.users);
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

      <div className="flex flex-col gap-2 bg-neutral-800 mt-[70px] p-5 rounded-md w-[600px] min-h-[700px]">
        <div className="flex justify-between items-center w-full">
          <input
            value={inputValue}
            placeholder="Search people"
            onChange={handleInput}
            type="text"
            className="bg-transparent px-5 border border-white border-solid rounded-full w-[90%] h-[50px] text-white"
          />
          <Search
            color="white"
            size={32}
            onClick={() => handleSearchClick()}
            className="cursor-pointer"
          />
        </div>

        {users &&
          users.map((user, index) => {
            return <UserCard key={index} user={user} />;
          })}
      </div>
    </div>
  );
};

export default DiscoverPeople;
