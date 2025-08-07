import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios-api.js";

const UserCard = ({ user }) => {
  
  const navigate = useNavigate();
  const { followingNo, setFollowingNo } = useContext(AppContext);
  const [isFollower, setIsFollower] = useState(user.isFollowing);
  
  

  const checkIsFollower = async (id) => {
    const response = await api.get(`/users/is-follower/${id}`);
    // //console.log(response.data?.follows);
    setIsFollower(response.data?.follows);
  };

  useEffect(() => {
    // checkIsFollower(user._id);
  }, []);

  const handleFollow = async (id) => {
    if (!isFollower) {
      await api.patch(`/users/follow/${id}`);
      setIsFollower(true);
      setFollowingNo(followingNo + 1);
    } else {
      await api.patch(`/users/unfollow/${id}`);
      setIsFollower(false);
      setFollowingNo(followingNo - 1);
    }
  };

  return (
    <div
      className="flex items-center gap-[9%] bg-neutral-900 p-2 md:p-3 rounded-3xl w-full"
      onClick={() => {
        if (isFollower == undefined) navigate("/profile");
        else navigate(`/user/${user._id}`);
      }}
    >
      <div className="w-12 md:w-16">
        <img
          className="rounded-full object-cover aspect-square"
          src={
            user.profile_image ||
            `https://api.dicebear.com/9.x/big-smile/svg?seed=${user.userName}&backgroundColor=c0aede`
          }
        ></img>
      </div>
      <div className="flex md:flex-row flex-col justify-center gap-1 md:gap-5 w-2/4 overflow-hidden text-white text-sm md:text-xl">
        <span>{user.fullName}</span>
        <span>@{user.userName}</span>
      </div>
      <div className="w-1/5">
        {isFollower != undefined && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation(); // Prevents event from propagating to parent elements
              handleFollow(user._id);
            }}
            className="bg-white px-2 md:px-5 py-2 rounded-2xl w-full text-xs md:text-base"
          >
            {isFollower ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
