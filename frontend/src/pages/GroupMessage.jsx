import { useContext, useEffect, useRef, useState } from "react";
import NavBar, { MobileLogoTop, MobileNavBar } from "../components/NavBar";
import { useForm } from "react-hook-form";
import { useSocket } from "../context/SoketContext";
import api from "../utils/axios-api.js";
import { useParams } from "react-router-dom";
import { ReceiverMsgBox, SendMsgBox } from "../components/MessageBox.jsx";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

import Group from "../assets/group.png";
import { GroupMembers } from "../components/GroupComponents.jsx";
import Modal from "../components/Modal.jsx";
let loggedInUserId;
// const loggedInUserId = localStorage.getItem("userId");

const DirectMessage = () => {
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUserByToken } = useContext(AppContext);
  loggedInUserId = currentUserByToken?.userId;
  const { socket } = useSocket();
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);
  const [members, setMembers] = useState([]);
  const chatRef = useRef(null);
  const navigate = useNavigate();
console.log("Current Messages:", messages);
  useEffect(() => {
    if (socket && conversation) {
      socket.emit("join_conversation", conversation?._id);
      

      socket.on("receive_message", (message) => {
        console.log("Received Message:", message);

        setMessages((prev) => [message, ...prev]);
        setMessagesAsRead(message._id);
        // Scroll to bottom after DOM updates
        chatRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
    return () => {
      socket?.off("receive_message");
      socket?.emit("leave_conversation", conversation?._id);
    };
  }, [socket, conversation?._id]);

  useEffect(() => {
    getConversation(conversationId, setConversation, setMembers);
  }, [conversationId]);

  useEffect(() => {
    getAllMessages(conversation?._id, setMessages);
  }, [conversation?._id]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const textareaRef = useRef(null);

  const onSubmit = async (data) => {
    //console.log(data);
    try {
      const response = await api.post(`/messages/send/${conversation?._id}`, {
        text: data.message,
        //   receiver is array of all participant id except logged in user id
        receiver: conversation?.participants.filter(
          (participant) => participant._id !== loggedInUserId
        ),
        //   receiver: [targetId],
      });
      //console.log(response.data);

      reset();
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // reset first
        textareaRef.current.style.height = "45px"; // your default/min height
      }
      // Scroll to bottom after DOM updates
    } catch (error) {
      console.error(error);
    }
  };

  // Auto-resize on typing
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const loggedUser = members?.find(
    (participant) => participant.member._id == currentUserByToken.userId
  );

  return (
    <div className="box-border relative flex flex-col items-center w-auto h-screen">
      <NavBar />
      <MobileNavBar />
      <MobileLogoTop />
      {/* main div */}
      <div className="flex md:flex-row flex-col justify-start gap-3 mt-[50px] md:mt-[70px] w-full h-[95%]">
        {/* Left side: Group members */}
        <div className="hidden md:flex flex-col gap-1 bg-[rgb(16,16,16)] p-2 rounded-lg w-[25%] h-[500px]">
          {members && members.length > 0 && <GroupMembers members={members} />}
        </div>
        {/* For mobile, button for modal */}
        <Modal isOpen={isModalOpen} onClose={handleModal}>
          {members && members.length > 0 && <GroupMembers members={members} />}
        </Modal>
        <div className="flex flex-col items-end bg-[rgb(16,16,16)] p-2 rounded-lg w-full md:w-2/4 h-[90%] md:h-[95%]">
          <div
            className="box-border flex items-center gap-4 py-1 border-gray-400/50 border-b w-full cursor-pointer"
            onClick={handleModal}
          >
            <img
              className="rounded-full w-12 h-12 object-cover"
              src={conversation?.avatar || Group}
            />
            <span className="text-white text-xl">
              {conversation?.groupName}
            </span>
          </div>
          <div
            className="flex flex-col-reverse gap-4 mt-auto p-2.5 w-full overflow-y-auto your-container"
            ref={chatRef}
          >
            {messages.map((message, index) => {
              //console.log(message.sender._id, loggedInUserId);

              if (message.sender == loggedInUserId) {
                return (
                  <SendMsgBox
                    key={message._id}
                    message={message}
                    sender_details={loggedUser?.member}
                  />
                );
              }
              const sender = members?.find(
                (participant) => participant.member._id == message.sender
              );
              console.log("Sender Details in GroupMessage:", sender);

              return (
                <ReceiverMsgBox
                  key={message._id}
                  message={message}
                  sender_details={sender?.member}
                  isGroup={true}
                />
              );
            })}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex justify-center items-end gap-1 w-full h-max"
          >
            <textarea
              placeholder="write message..."
              {...register("message", { required: true })}
              // ref={textareaRef}
              ref={(e) => {
                register("message").ref(e);
                textareaRef.current = e;
              }}
              rows={1}
              onInput={handleInput}
              className={`content-center bg-transparent px-3 py-2 border border-[#717171] rounded-[25px] md:w-[90%] w-[80%]
             min-h-[45px] overflow-hidden text-white leading-6 resize-none
             `}
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE 10+
              }}
            />

            <input
              type="submit"
              value="send"
              className="bg-white px-4 py-2 rounded-full w-[20%] md:w-[10%] text-black"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

const getConversation = async (conversationId, setConversation, setMembers) => {
  try {
    const response = await api.get(
      `/messages/conversation-id/${conversationId}`
    );
    //console.log(response.data.data);
    setConversation(response.data.data.conversation);
    setMembers(response.data.data.members);
  } catch (error) {
    console.error("Error fetching conversation data", error);
  }
};

const getAllMessages = async (conversationId, setMessages) => {
  if (!conversationId) return;
  try {
    const response = await api.get(`/messages/all-messages/${conversationId}`);
    //console.log(response.data.data);
    setMessages(response.data.data);
  } catch (error) {
    console.error("Error fetching messages", error);
  }
};

const setMessagesAsRead = async (messageId) => {
  try {
    const response = await api.patch(`/messages/set-read/${messageId}`);
    //console.log(response.data.data);
  } catch (error) {
    console.error("Error setting messages as read", error);
  }
};

export default DirectMessage;
