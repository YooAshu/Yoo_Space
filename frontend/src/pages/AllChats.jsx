import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../utils/axios-api.js";
import { useNavigate } from "react-router-dom";

const AllChats = () => {
  const [convoList, setConvoList] = useState([]);
  const loggedInUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    getAllConversations(setConvoList);
  }, []);

  return (
    <div className="box-border relative flex flex-col items-center w-auto h-screen">
      <NavBar />
      <div className="flex flex-col gap-5 bg-[rgb(16,16,16)] px-2 py-5 rounded-lg w-2/4 h-[95%] overflow-y-auto your-container">
        {convoList.map((convo) => {
          const otherParticipant = convo.participants.find(
            (participant) => participant._id !== loggedInUserId
          );
          return (
            <div
              key={convo._id}
              className="flex justify-start items-center gap-5 bg-neutral-800 m-2 p-2 rounded-lg w-[97%] h-[10%] overflow-hidden cursor-pointer max-h[15%]"
              onClick={() => {navigate(`/direct/${otherParticipant._id}`)}}
            >
              <img
                className="rounded-full w-8 h-8 object-cover"
                src={
                  otherParticipant.profile_image ||
                  `https://api.dicebear.com/9.x/big-smile/svg?seed=${otherParticipant.userName}&backgroundColor=c0aede`
                }
              />
              <div>
                <h1 className="text-white">{otherParticipant.userName}</h1>
                <p className="text-gray-400">{convo.lastMessage.text}</p>
              </div>
              {/* <span className="text-gray-500">{convo.timestamp}</span> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getAllConversations = async (setConvoList) => {
  try {
    const response = await api.get("/api/messages/all-conversation");
    setConvoList(response.data.data);
    console.log("Conversations:", response.data.data);
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

export default AllChats;
