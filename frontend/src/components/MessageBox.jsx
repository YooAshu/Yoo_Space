

const SendMsgBox = ({ message ,sender_details}) => {
  return (
    <div className="flex justify-end items-start gap-2">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-2 py-1 rounded-lg max-w-xs overflow-x-hidden text-white">
        <p>{message.text}</p>
        {/* <span className="text-gray-300 text-xs">{new Date(message.createdAt).toLocaleTimeString()}</span> */}
      </div>
      <img
        className="rounded-full w-8 h-8 object-cover"
        src={
          sender_details.profile_image ||
          `https://api.dicebear.com/9.x/big-smile/svg?seed=${sender_details.userName}&backgroundColor=c0aede`
        }
      />
    </div>
  );
};

const ReceiverMsgBox = ({ message, isGroup = false, sender_details }) => {
  console.log("Sender Details in ReceiverMsgBox:", sender_details);

  return (
    <div className="flex justify-start items-center gap-2">
      <img
        className="rounded-full w-8 h-8 object-cover"
        src={
          sender_details.profile_image ||
          `https://api.dicebear.com/9.x/big-smile/svg?seed=${sender_details.userName}&backgroundColor=c0aede`
        }
      />
      <div>
        <span className="text-[10px] text-white">
          {isGroup && sender_details.userName}
        </span>
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-2 py-1 rounded-lg max-w-xs overflow-x-hidden text-white">
          <p>{message.text}</p>
          {/* <span className="text-gray-300 text-xs">{new Date(message.createdAt).toLocaleTimeString()}</span> */}
        </div>
      </div>
    </div>
  );
};

export { SendMsgBox, ReceiverMsgBox };
