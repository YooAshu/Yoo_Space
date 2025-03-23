import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const DiscoverPeople = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/users/discover");
      setUsers(response.data.data.users);
      // console.log(response.data.data.users);
    } catch (error) {
      console.error("error fetching users", error);

      if (error.response?.status == 401) navigate("/login");
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  if (!users) {
    return <div className="relative w-screen min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <NavBar />
      <div className="flex flex-col gap-5 bg-neutral-800 my-14 p-5 rounded-md w-[600px] min-h-[700px]">
        {users &&
          users.map((user, index) => {
            return <UserCard key={index} user={user} />;
          })}
      </div>
    </div>
  );
};

export default DiscoverPeople;
