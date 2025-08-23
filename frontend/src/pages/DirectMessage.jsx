import { useContext, useEffect, useRef, useState } from "react";
import NavBar, { MobileLogoTop, MobileNavBar } from "../components/NavBar";
import { useForm } from "react-hook-form";
import { useSocket } from "../context/SoketContext";
import api from "../utils/axios-api.js";
import { useParams } from "react-router-dom";
import { ReceiverMsgBox, SendMsgBox } from "../components/MessageBox.jsx";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const DirectMessage = () => {
  const [messages, setMessages] = useState([]);
  const { currentUserByToken } = useContext(AppContext);
  const { socket } = useSocket();
  const { targetId } = useParams();
  const [conversation, setConversation] = useState(null);
  const chatRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket && conversation) {
      socket.emit("join_conversation", conversation?._id);

      socket.on("receive_message", (message) => {
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
    getConversation(targetId, setConversation);
  }, [targetId]);

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
        receiver: [targetId],
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

  const sender = conversation?.participants.find(
    (participant) => participant._id == targetId
  );
  const loggedUser = conversation?.participants.find(
    (participant) => participant._id == currentUserByToken.userId
  );


  return (
    <div className="box-border relative flex flex-col items-center bg-[rgb(16,16,16)] md:bg-transparent w-auto h-screen">
      <NavBar />
      <MobileNavBar />
      <MobileLogoTop />
      <div className="flex flex-col items-end bg-[rgb(16,16,16)] mt-[50px] md:mt-[70px] p-2 rounded-lg w-full md:w-2/4 h-[85%] md:h-[95%]">
        <div
          className="box-border flex items-center gap-4 py-1 border-gray-400/50 border-b w-full cursor-pointer"
          onClick={() => navigate(`/user/${targetId}`)}
        >
          <img
            className="rounded-full w-12 h-12 object-cover"
            src={
              sender?.profile_image ||
              `https://api.dicebear.com/9.x/big-smile/svg?seed=${sender?.userName}&backgroundColor=c0aede`
            }
          />
          <span className="text-white text-xl">@{sender?.userName}</span>
        </div>
        <div
          className="flex flex-col-reverse gap-4 mt-auto p-2.5 w-full overflow-y-auto your-container"
          ref={chatRef}
        >
          {messages.map((message, index) => {
            console.log(message);
            
            if (message.sender === targetId) {
              return <ReceiverMsgBox key={message._id} message={message} sender_details={sender} />;
            }
            return <SendMsgBox key={message._id} message={message} sender_details={loggedUser} />;
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
            className={`content-center bg-transparent px-3 py-2 border border-[#717171] rounded-[25px] w-[80%] md:w-[90%]
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
  );
};

const getConversation = async (targetId, setConversation) => {
  try {
    const response = await api.get(`/messages/conversation/${targetId}`);
    //console.log(response.data.data);
    setConversation(response.data.data);
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
