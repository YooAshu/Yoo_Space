import { useState, useEffect, useContext } from "react";
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
      <h2 className="bg-white mb-3 py-3 rounded-xl font-bold text-black text-xl text-center">
        Group Invites
      </h2>
      <div className="flex flex-col flex-1 gap-2 mb-2 rounded-xl w-full h-full overflow-y-auto your-container">
        {groupInvites.length == 0 && <div className="mt-8 w-full text-white text-center">You have 0 invites</div>}
        {/* Map through the group invites and display them */}

        {/* Example group invite */}
        {groupInvites.length > 0 &&
          groupInvites.map((invite) => {
            return (
              <div
                className="flex justify-start items-center gap-5 bg-neutral-800 px-2 py-1 rounded-lg w-full h-[15%] overflow-hidden cursor-pointer"
                key={invite._id}
              >
                <img
                  className="rounded-full w-12 h-12 object-cover"
                  src={invite.group.avatar || Group}
                />
                <div className="flex flex-col justify-start h-full">
                  <p className="opacity-65 text-white text-xs">
                    {invite.invited_by.userName} invited you to the group
                  </p>
                  <h1 className="overflow-hidden text-white text-sm md:text-base whitespace-nowrap">
                    {invite.group.groupName}
                  </h1>
                </div>
                <button
                  className="bg-gradient-to-r from-purple-600 to-indigo-700 ml-auto px-3 py-1 rounded-full text-white"
                  onClick={() => {
                    AcceptGroupInvite(
                      invite.group._id,
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
    const response = await api.get("/messages/group-invites");
    if (response.status === 200) {
      setGroupInvites(response.data.data);
      //console.log("Group invites fetched successfully:", response.data.data);
    }
  } catch (error) {
    console.error("Error fetching group invites:", error);
  }
};

const AcceptGroupInvite = async (
  groupId,
  invite,
  showToast,
  setGroupInvites,
  setConvoList
) => {
  try {
    const response = await api.patch(
      `/messages/group-invite-accept/${groupId}`
    );
    if (response.status === 200) {
      // alert("Group invite accepted successfully!");
      showToast({
        message: "Group invite accepted successfully!",
        type: "success",
        id: "group-invite",
      });
      const inviteId = invite._id;
      setGroupInvites((prevInvites) => {
        return prevInvites.filter((invite) => invite._id !== inviteId);
      });
      setConvoList((prevConvoList) => {
        // Add the new group conversation to the list
        return [invite.group, ...prevConvoList];
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
