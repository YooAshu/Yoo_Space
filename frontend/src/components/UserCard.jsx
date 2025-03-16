import React, { useState, useEffect } from "react";
import axios from "axios";

const UserCard = ({ user }) => {
  const [isFollower, setIsFollower] = useState(false);

  const checkIsFollower = async (id) => {
    const response = await axios.get(`/api/users/is-follower/${id}`);
    // console.log(response.data?.follows);
    setIsFollower(response.data?.follows);
  };

  useEffect(() => {
    checkIsFollower(user._id);
  }, []);

  const handleFollow = async (id) => {
    if (!isFollower) {
      await axios.patch(`/api/users/follow/${id}`);
      setIsFollower(true)
    } else {
      await axios.patch(`/api/users/unfollow/${id}`);
      setIsFollower(false)
    }
  };

  return (
    <div className="flex justify-between items-center bg-neutral-900 p-3 rounded-3xl w-full">
      <div className="w-16">
        <img
          className="rounded-full"
          src={
            user.profile_image ||
            `https://api.dicebear.com/9.x/big-smile/svg?seed=${user.userName}&backgroundColor=c0aede`
          }
        ></img>
      </div>
      <div className="flex gap-5 text-white text-xl">
        <span>{user.fullName}</span>
        <span>@{user.userName}</span>
      </div>
      <div>
        <button
          type="button"
          onClick={() => handleFollow(user._id)}
          className="bg-white px-5 py-2 rounded-2xl"
        >
          {isFollower ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
