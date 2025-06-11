import React, { useState, useEffect, useContext } from "react";
import api from "../utils/axios-api.js";
import Group from "../assets/group.png";
import { useSocket } from "../context/SoketContext.jsx";
import { AppContext } from "../context/AppContext.jsx";

const GroupInvites = ({ setConvoList }) => {
  const [groupInvites, setGroupInvites] = useState([]);
  const { showToast } = useContext(AppContext);
  useEffect(() => {
    getGroupInvites(setGroupInvites);
  }, []);
  const { socket } = useSocket();
  return (
    <>
      <h2 className="font-bold text-white text-xl text-center">
        Group Invites
      </h2>
      <div className="flex flex-col flex-1 gap-5 rounded-xl w-full h-full overflow-y-auto your-container">
        {/* Map through the group invites and display them */}

        {/* Example group invite */}
        {groupInvites.map((invite) => {
          return (
            <div
              className="flex justify-start items-center gap-5 bg-neutral-800 p-2 rounded-lg w-[97%] h-[15%] overflow-hidden cursor-pointer"
              key={invite._id}
            >
              <img
                className="rounded-full w-12 h-12 object-cover"
                src={invite.avatar || Group}
              />
              <div>
                <p>
                  {/* {invite.} */}
                </p>
                <h1 className="overflow-hidden text-white whitespace-nowrap">
                  {invite.groupName}
                </h1>
              </div>
              <button
                className="bg-gradient-to-r from-purple-600 to-indigo-700 ml-auto px-3 py-1 rounded-full text-white"
                onClick={() => {
                  AcceptGroupInvite(
                    invite._id,
                    invite,
                    showToast,
                    setGroupInvites,
                    setConvoList
                  );
                }}
              >
                Accept
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

const getGroupInvites = async (setGroupInvites) => {
  try {
    const response = await api.get("/api/messages/group-invites");
    if (response.status === 200) {
      setGroupInvites(response.data.data);
      console.log("Group invites fetched successfully:", response.data.data);
    }
  } catch (error) {
    console.error("Error fetching group invites:", error);
  }
};

const AcceptGroupInvite = async (
  inviteId,
  invite,
  showToast,
  setGroupInvites,
  setConvoList
) => {
  try {
    const response = await api.patch(
      `/api/messages/group-invite-accept/${inviteId}`
    );
    if (response.status === 200) {
      // alert("Group invite accepted successfully!");
      showToast({
        message: "Group invite accepted successfully!",
        type: "success",
        id: "group-invite",
      });
      setGroupInvites((prevInvites) => {
        return prevInvites.filter((invite) => invite._id !== inviteId);
      });
      setConvoList((prevConvoList) => {
        // Add the new group conversation to the list
        return [invite, ...prevConvoList];
      });
    }
  } catch (error) {
    console.error("Error accepting group invite:", error);
    showToast({
      message: "failed to accept group invite",
      type: "error",
      id: "group-invite",
    });
  }
};

export default GroupInvites;
