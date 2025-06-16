import { useContext, useEffect, useState } from "react";
import NavBar, { MobileLogoTop, MobileNavBar } from "../components/NavBar";
import api from "../utils/axios-api.js";
import { useNavigate } from "react-router-dom";
import AddGroup from "../components/AddGroup.jsx";
import GroupInvites from "../components/GroupInvites.jsx";

import Group from "../assets/group.png";
import { AppContext } from "../context/AppContext.jsx";
import Modal from "../components/Modal.jsx";

const AllChats = () => {
  const [convoList, setConvoList] = useState([]);
  const [isInvitesModalOpen, setIsInvitesModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  // const loggedInUserId = localStorage.getItem("userId");
  const { currentUserByToken } = useContext(AppContext);
  const loggedInUserId = currentUserByToken?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    getAllConversations(setConvoList);
  }, []);

  const handleInvitesModal = () => {
    setIsInvitesModalOpen(!isInvitesModalOpen);
  };
  const handleAddGroupModal = () => {
    setIsAddGroupModalOpen(!isAddGroupModalOpen);
  };

  return (
    <div className="box-border relative flex flex-col items-center w-auto h-screen">
      <NavBar />
      <MobileNavBar />
      <MobileLogoTop />
      {/* main div */}
      <div className="flex md:flex-row flex-col justify-center gap-3 mt-[70px] w-full h-[90%]">
        <div className="hidden md:flex flex-col gap-1 bg-[rgb(16,16,16)] p-2 w-[25%] h-max max-h-[500px]">
          <GroupInvites setConvoList={setConvoList} />
        </div>
        {/* for mobile, button for modal */}
        <div className="md:hidden flex justify-around items-center w-full text-xs">
          <div
            className="bg-gradient-to-r from-purple-600 to-indigo-700 px-4 py-2 rounded-full text-white"
            onClick={handleInvitesModal}
          >
            Check invites
            <Modal isOpen={isInvitesModalOpen} onClose={handleInvitesModal}>
              <GroupInvites setConvoList={setConvoList} />
            </Modal>
          </div>
          <div
            className="bg-gradient-to-r from-purple-600 to-indigo-700 px-4 py-2 rounded-full text-white"
            onClick={handleAddGroupModal}
          >
            Create Group
            <Modal isOpen={isAddGroupModalOpen} onClose={handleAddGroupModal}>
              {<AddGroup handleModal={handleAddGroupModal} setConvoList={setConvoList}/>}
            </Modal>
          </div>
        </div>

        <div className="flex flex-col bg-[rgb(16,16,16)] px-2 py-5 rounded-lg w-full md:w-2/4 h-full overflow-y-auto your-container">
          {convoList.map((convo) => {
            const isLastMessageSeen =
              convo.lastMessage?.seenBy.includes(loggedInUserId);
            // Check if the conversation is a group or not
            if (!convo.isGroup) {
              const otherParticipant = convo.participants.find(
                (participant) => participant._id !== loggedInUserId
              );

              return (
                <div
                  key={convo._id}
                  className="flex justify-start items-center gap-5 bg-neutral-900 mx-2 my-1 p-2 rounded-lg w-[97%] h-[10%] overflow-hidden cursor-pointer max-h[15%]"
                  onClick={() => {
                    navigate(`/direct/${otherParticipant._id}`);
                  }}
                >
                  <img
                    className="rounded-full h-full object-cover aspect-square"
                    src={
                      otherParticipant.profile_image ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${otherParticipant.userName}&backgroundColor=c0aede`
                    }
                  />
                  <div className="flex flex-col justify-start w-[90%] h-full">
                    <h1 className="text-white">{otherParticipant.userName}</h1>
                    <p
                      className={`${
                        isLastMessageSeen
                          ? "text-gray-400"
                          : "text-white font-b"
                      }`}
                    >
                      {convo.lastMessage.text}
                    </p>
                  </div>
                  {(convo.unseenCount!== undefined && convo.unseenCount!== null  && convo.unseenCount != 0) && (
                    <span className="flex justify-center items-center bg-white rounded-full w-[25px] h-[25px] aspect-square font-bold text-black">
                      {convo.unseenCount}
                    </span>
                  )}
                </div>
              );
            }
            // If it's a group conversation
            return (
              <div
                key={convo._id}
                className="flex justify-start items-center gap-5 bg-neutral-900 mx-2 my-1 p-2 rounded-lg w-[97%] h-[10%] overflow-hidden cursor-pointer max-h[15%]"
                onClick={() => {
                  navigate(`/group/${convo._id}`);
                }}
              >
                <img
                  className="rounded-full h-full object-cover aspect-square"
                  src={convo.avatar || Group}
                />
                <div className="flex flex-col justify-start w-[90%] h-full">
                  <h1 className="text-white">{convo.groupName}</h1>
                  <p
                    className={`${
                      isLastMessageSeen ? "text-gray-400" : "text-white font-b"
                    }`}
                  >
                    {convo.lastMessage?.text}
                  </p>
                </div>
                {(convo.unseenCount!== undefined && convo.unseenCount!== null && convo.unseenCount != 0) && (
                  <span className="flex justify-center items-center bg-white rounded-full w-[25px] h-[25px] aspect-square font-bold text-black">
                    {convo.unseenCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="hidden md:block w-[25%] h-full overflow-hidden">
          {<AddGroup setConvoList={setConvoList}/>}
        </div>
      </div>
    </div>
  );
};

const getAllConversations = async (setConvoList) => {
  try {
    const response = await api.get("/messages/all-conversation");
    setConvoList(response.data.data);
    // console.log("Conversations:", response.data.data);
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

export default AllChats;
