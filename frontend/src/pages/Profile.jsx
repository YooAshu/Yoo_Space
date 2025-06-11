import axios from "axios";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import FollowModal from "../components/FollowModal";
import { AppContext } from "../context/AppContext";
import generateGradient from "../utils/generateGradient.js";
import AddPostButton from "../components/AddPostButton.jsx";
import AddPostModal from "../components/AddPostModal.jsx";
import Post from "../components/Post.jsx";
import api from "../utils/axios-api.js";

const Profile = () => {
  const { followingNo, setFollowingNo } = useContext(AppContext);
  const [isFollowerModalOpen, setFollowerModalOpen] = useState(false);
  const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
  const [isAddPostModalOpen, setAddPostModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [followerList, setfollowerList] = useState(null);
  const [followingList, setfollowingList] = useState(null);
  const openFollowerModal = () => setFollowerModalOpen(true);
  const closeFollowerModal = () => setFollowerModalOpen(false);
  const openFollowingModal = () => setFollowingModalOpen(true);
  const closeFollowingModal = () => setFollowingModalOpen(false);
  const openAddPostModal = () => setAddPostModalOpen(true);
  const closeAddPostModal = () => setAddPostModalOpen(false);

  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  const [option, setOption] = useState(1);

  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("/api/users/current-user");
      const user = response.data.data;
      setUserData(user);
      console.log(user);
      
      setFollowingNo(user.no_of_following);
    } catch (error) {
      console.error("error fetching user data", error);
      if (error.response?.status == 401) navigate("/login");
    }
  };

  const getPosts = async () => {
    try {
      const postsResponse = await api.get(`/api/posts/currentUser`);
      const userPosts = postsResponse.data.data;
      // console.log(postsResponse.data.data);
      setPosts(userPosts);
      // console.log(response.data.data);
    } catch (error) {
      console.error("error fetching user posts", error);
    }
  };

  const getLikedPosts = async () => {
    try {
      const postsResponse = await api.get(`/api/posts/user-likes`);
      const likedPosts = postsResponse.data.data;
      // console.log(postsResponse.data.data);
      setLikedPosts(likedPosts);
      // console.log(response.data.data);
    } catch (error) {
      console.error("error fetching user liked posts", error);
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
      setfollowingList(null);
      const response = await axios.get("/api/users/followings");
      setfollowingList(response.data.data);
      // console.log(response.data.data);
    } catch (error) {
      console.error("error fetching followings data", error);
    }
  };
  useEffect(() => {
    getCurrentUser();
    getFollowers();
    getLikedPosts();
  }, []);

  useEffect(() => {
    if (isFollowingModalOpen) getFollowings();
  }, [isFollowingModalOpen]);

  useEffect(() => {
    if (!isAddPostModalOpen) getPosts();
  }, [isAddPostModalOpen]);

  if (!userData) {
    return <div className="relative w-screen min-h-screen">Loading...</div>;
  }

  return (
    <div className="relative w-auto min-h-screen">
      <NavBar />
      {/* cover image */}
      <div className="">
        <div
          className="w-full h-56"
          style={{ background: generateGradient(userData.userName) }}
        >
          {userData.cover_image && (
            <img
              className="w-full h-full object-cover"
              src={userData.cover_image}
            />
          )}
        </div>

        {/* profile image */}
        <div className="top-40 left-16 absolute w-48 h-48">
          <img
            className="rounded-full w-full h-full object-cover"
            src={
              userData.profile_image ||
              `https://api.dicebear.com/9.x/big-smile/svg?seed=${userData.userName}&backgroundColor=c0aede`
            }
          />
        </div>

        {/* user details */}
        <div className="left-[20%] relative flex items-center gap-32 p-5 w-4/5 text-white">
          <div className="flex flex-col gap-5 w-2/5">
            <div className="flex gap-5">
              <span>{userData?.fullName || "full name"}</span>
              <span>@{userData?.userName || "username"}</span>
            </div>
            <div>{userData.bio || ""}</div>
          </div>

          <div className="flex gap-12 text-center">
            <div className="flex flex-col gap-2">
              <span className="text-3xl">{userData.no_of_post}</span>
              <span>Posts</span>
            </div>
            <div
              className="flex flex-col gap-2 cursor-pointer"
              onClick={openFollowerModal}
            >
              <span className="text-3xl">{userData.no_of_follower}</span>
              <span>Follower</span>
            </div>
            <div
              className="flex flex-col gap-2 cursor-pointer"
              onClick={openFollowingModal}
            >
              <span className="text-3xl">{followingNo}</span>
              <span>Following</span>
            </div>
          </div>
          <div
            className="p-[6px] border border-white rounded-[100%_30px] font-medium text-[20px] cursor-pointer"
            onClick={() => navigate("/profile/update")}
          >
            Update Profile
          </div>
        </div>
      </div>
      <AddPostButton openAddPostModal={openAddPostModal} />
      {/* follower modal */}
      <FollowModal
        isOpen={isFollowerModalOpen}
        onClose={closeFollowerModal}
        list={followerList}
      />

      {/* following modal */}
      <FollowModal
        isOpen={isFollowingModalOpen}
        onClose={closeFollowingModal}
        list={followingList}
      />
      <AddPostModal
        isOpen={isAddPostModalOpen}
        onClose={closeAddPostModal}
        user={{ userName: userData.userName, img: userData.profile_image }}
        setUserData={setUserData}
      />
      <div className="flex justify-evenly mt-20 w-full text-white text-2xl">
        <span
          onClick={() => {
            setOption(1);
          }}
          style={{
            borderBottom:
              option == 1 ? "2px solid #ffffff" : ".5px solid #ffffff63",
          }}
          className="pb-4 w-[30%] text-center cursor-pointer"
        >
          My Posts
        </span>
        <span
          onClick={() => {
            setOption(2);
          }}
          style={{
            borderBottom:
              option == 2 ? "2px solid #ffffff" : ".5px solid #ffffff63",
          }}
          className="w-[30%] text-center cursor-pointer"
        >
          Liked Posts
        </span>
      </div>
      {posts.length > 0 && (
        <div className="flex justify-center mt-36 w-full h-fit">
          <div className="bg-neutral-900 mb-36 w-1/2">
            {option == 1
              ? posts.map((post, index) => {
                  return <Post key={post._id} post={post} />;
                })
              : likedPosts.map((post, index) => {
                  return <Post key={post._id} post={post} />;
                })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
