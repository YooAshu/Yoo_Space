import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import FollowModal from "../components/FollowModal";

const Profile = () => {
  const [isFollowerModalOpen, setFollowerModalOpen] = useState(false);
  const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [followerList, setfollowerList] = useState(null);
  const [followingList, setfollowingList] = useState(null);
  const openFollowerModal = () => setFollowerModalOpen(true);
  const closeFollowerModal = () => setFollowerModalOpen(false);
  const openFollowingModal = () => setFollowingModalOpen(true);
  const closeFollowingModal = () => setFollowingModalOpen(false);

  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/api/users/current-user");
      setUserData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("error fetching user data", error);
      navigate("/login");
    }
  };
  const getFollowers = async () => {
    try {
      const response = await axios.get("/api/users/followers");
      setfollowerList(response.data.data);
    } catch (error) {
      console.error("error fetching followers data", error);
    }
  };
  const getFollowings = async () => {
    try {
      const response = await axios.get("/api/users/followings");
      setfollowingList(response.data.data);
    } catch (error) {
      console.error("error fetching followings data", error);
    }
  };
  useEffect(() => {
    getCurrentUser();
    getFollowers();
    getFollowings();
  }, []);

  if (!userData) {
    return <div className="relative w-screen min-h-screen">Loading...</div>;
  }

  return (
    <div className="relative w-screen min-h-screen">
      <NavBar />
      <div className="w-full h-48">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?q=80&w=3284&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>

      <div className="top-28 left-16 absolute w-48 h-48">
        <img
          className="rounded-full w-full h-full object-cover"
          src={
            userData.profile_image ||
            `https://api.dicebear.com/9.x/big-smile/svg?seed=${userData.userName}&backgroundColor=c0aede`
          }
        />
      </div>

      <div className="left-72 absolute flex gap-32 p-5 text-white">
        <div className="flex flex-col gap-5">
          <div>{userData?.fullName || "full name"}</div>
          <div>@{userData?.userName || "username"}</div>
        </div>
        <div className="flex gap-12 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-3xl">{userData.no_of_post}</span>
            <span>Posts</span>
          </div>
          <div className="flex flex-col gap-2" onClick={openFollowerModal}>
            <span className="text-3xl">{userData.no_of_follower}</span>
            <span>Follower</span>
          </div>
          <div className="flex flex-col gap-2" onClick={openFollowingModal}>
            <span className="text-3xl">{userData.no_of_following}</span>
            <span>Following</span>
          </div>
        </div>
      </div>
      <FollowModal isOpen={isFollowerModalOpen} onClose={closeFollowerModal} list = {followerList} />
      <FollowModal isOpen={isFollowingModalOpen} onClose={closeFollowingModal} list = {followingList} />
    </div>
  );
};

export default Profile;
