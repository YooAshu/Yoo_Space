import axios from "axios";
import React from "react";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import FollowModal from "../components/FollowModal";
import { useParams } from "react-router-dom";
import generateGradient from "../utils/generateGradient.js";
import Post from "../components/Post.jsx";
import api from "../utils/axios-api.js";

const UserProfile = () => {
  const { userId } = useParams();
  //   const { followingNo, setFollowingNo } = useContext(AppContext);
  const [isFollowerModalOpen, setFollowerModalOpen] = useState(false);
  const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [followerList, setfollowerList] = useState(null);
  const [followingList, setfollowingList] = useState(null);
  const openFollowerModal = () => setFollowerModalOpen(true);
  const closeFollowerModal = () => setFollowerModalOpen(false);
  const openFollowingModal = () => setFollowingModalOpen(true);
  const closeFollowingModal = () => setFollowingModalOpen(false);
  const [posts, setPosts] = useState([]);
  const [isFollower, setIsFollower] = useState(false);

  const navigate = useNavigate();

  const getUserDetail = async () => {
    try {
      const response = await api.get(`/api/users/profile/${userId}`);
      const user = response.data.data;
      setUserData(user);
    } catch (error) {
      console.error("error fetching user data", error);
    }
  };

  const getPosts = async () => {
    try {
      const postsResponse = await axios.get(`/api/posts/user/${userId}`);
      const userPosts = postsResponse.data.data;
      setPosts(userPosts);
      // console.log(response.data.data);
    } catch (error) {
      console.error("error fetching user posts", error);
      if (error.response?.status == 401) navigate("/login");
    }
  };
  const getFollowers = async () => {
    try {
      const response = await axios.get(`/api/users/followers/${userId}`);
      setfollowerList(response.data.data);
    } catch (error) {
      console.error("error fetching followers data", error);
    }
  };
  const getFollowings = async () => {
    try {
      const response = await axios.get(`/api/users/followings/${userId}`);
      setfollowingList(response.data.data);
    } catch (error) {
      console.error("error fetching followings data", error);
    }
  };

  const checkIsFollower = async (id) => {
    const response = await axios.get(`/api/users/is-follower/${id}`);
    // console.log(response.data?.follows);
    setIsFollower(response.data?.follows);
  };

  const handleFollow = async (id) => {
    if (!isFollower) {
      await axios.patch(`/api/users/follow/${id}`);
      setIsFollower(true);
    } else {
      await axios.patch(`/api/users/unfollow/${id}`);
      setIsFollower(false);
    }
  };

  useEffect(() => {
    closeFollowerModal();
    closeFollowingModal();
    getUserDetail();
    getFollowers();
    getFollowings();
    getPosts();
    checkIsFollower(userId);
  }, [String(userId)]);

  if (!userData) {
    return <div className="relative w-screen min-h-screen">Loading...</div>;
  }

  return (
    <div className="relative w-auto min-h-screen">
      <NavBar />
      {/* cover image */}
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
      <div className="flex flex-col justify-between items-center gap-10 p-5 w-full text-white">
        <div className="flex justify-between items-center w-[60%]">
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
              <span className="text-3xl">{userData.no_of_following}</span>
              <span>Following</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-[15%] pb-10 border-gray-400/50 border-b w-2/4">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation(); // Prevents event from propagating to parent elements
              handleFollow(userData._id);
            }}
            className="bg-white px-5 py-2 rounded-2xl w-[20%] text-black"
          >
            {isFollower ? "Following" : "Follow"}
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation(); // Prevents event from propagating to parent elements
              navigate(`/direct/${userData._id}`)
            }}
            className="bg-white px-5 py-2 rounded-2xl w-[20%] text-black"
          >
            Message
          </button>
        </div>
      </div>

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

      {posts.length > 0 && (
        <div className="flex justify-center mt-20 w-full h-fit">
          <div className="bg-neutral-900 w-1/2">
            {posts.map((post, index) => {
              return <Post key={index} post={post} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
