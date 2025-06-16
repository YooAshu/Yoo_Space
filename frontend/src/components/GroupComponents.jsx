
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
              className="flex justify-start items-center gap-5 bg-neutral-800 p-2 rounded-lg w-full h-[10%] md:h-[15%] overflow-hidden cursor-pointer"
              key={member.member._id}
            >
              <img
                className="rounded-full w-12 h-12 object-cover aspect-square"
                src={
                  member.member.profile_image ||
                  `https://api.dicebear.com/9.x/big-smile/svg?seed=${member.member.userName}&backgroundColor=c0aede`
                }
              />
              <div className="flex justify-between items-center w-full">
                <h1 className="overflow-hidden text-white whitespace-nowrap">
                  {member.member.userName}
                </h1>
                {member.role=="admin" && (
                  <span className="bg-white px-2 py-1 rounded-full font-bold text-black text-sm">Admin</span>
                )}
                {member.role=="owner" && (
                  <span className="bg-violet-600 px-2 py-1 rounded-full font-bold text-white text-sm">Owner</span>
                )}
              </div>
            </div>
          );
      })}
    </>
  );
};

export { GroupMembers };
