import React from "react";

const GroupMembers = ({ members }) => {
  return (
    <>
      <h2 className="font-bold text-white text-xl text-center">
        Group Members
      </h2>

      {members.map((member) => {
        if (member.status == "joined")
          return (
            <div
              className="flex justify-start items-center gap-5 bg-neutral-800 p-2 rounded-lg w-[97%] h-[15%] overflow-hidden cursor-pointer"
              key={member.user._id}
            >
              <img
                className="rounded-full w-12 h-12 object-cover"
                src={
                  member.user.profile_image ||
                  `https://api.dicebear.com/9.x/big-smile/svg?seed=${member.user.userName}&backgroundColor=c0aede`
                }
              />
              <div className="flex justify-between items-center w-full">
                <h1 className="overflow-hidden text-white whitespace-nowrap">
                  {member.user.userName}
                </h1>
                {member.isAdmin && (
                  <span className="bg-white p-1 rounded-full font-bold text-black text-sm">Admin</span>
                )}
              </div>
            </div>
          );
      })}
    </>
  );
};

export { GroupMembers };
