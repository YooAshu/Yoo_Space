import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserCardV2 = ({ user }) => {
  const navigate = useNavigate();
  const { followingNo, setFollowingNo } = useContext(AppContext);
  const [isFollower, setIsFollower] = useState(false);

  const checkIsFollower = async (id) => {
    const response = await axios.get(`/api/users/is-follower/${id}`);
    // console.log(response.data?.follows);
    setIsFollower(response.data?.follows);
  };

  useEffect(() => {
    // checkIsFollower(user._id);
  }, []);

  const handleFollow = async (id) => {
    if (!isFollower) {
      await axios.patch(`/api/users/follow/${id}`);
      setIsFollower(true);
      setFollowingNo(followingNo + 1);
    } else {
      await axios.patch(`/api/users/unfollow/${id}`);
      setIsFollower(false);
      setFollowingNo(followingNo - 1);
    }
  };

  return (
    <div
      className="flex items-center gap-[9%] bg-neutral-900 p-3 rounded-3xl w-full"
      onClick={() => {
        if (isFollower == undefined) navigate("/profile");
        else navigate(`/user/${user._id}`);
      }}
    >
      <div className="w-16">
        <img
          className="rounded-full aspect-square"
          src={
            user.profile_image ||
            `https://api.dicebear.com/9.x/big-smile/svg?seed=${user.userName}&backgroundColor=c0aede`
          }
        ></img>
      </div>
      <div className="flex justify-center gap-5 w-2/4 overflow-hidden text-white text-xl">
        <span>{user.fullName}</span>
        <span>@{user.userName}</span>
      </div>
      <div className="w-1/5">
        
      </div>
    </div>
  );
};

export default UserCardV2;
