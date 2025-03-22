import axios from "axios";
import React, { useEffect, useState } from "react";
import RedHeart from "../assets/red-heart.png";
import WhiteHeart from "../assets/white-heart.png";
import { useNavigate } from "react-router-dom";
const Post = ({ post }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likeNo, setLikeNo] = useState(post.no_of_like);

  const checkIsLiked = async (id) => {
    const response = await axios.get(`/api/posts/is-liked/${id}`);
    setIsLiked(response.data?.liked);
  };

  useEffect(() => {
    checkIsLiked(post._id);
  }, []);

  const handleLike = async (id) => {
    if (!isLiked) {
      await axios.patch(`/api/posts/like/${id}`);
      setIsLiked(true);
      setLikeNo((prev) => prev + 1);
    } else {
      await axios.patch(`/api/posts/unlike/${id}`);
      setIsLiked(false);
      setLikeNo((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 bg-black m-5 p-3 rounded-3xl w-auto min-h-52">
      <div
        className="flex items-center gap-2"
        onClick={() => {
          if (localStorage.getItem("userId") == post.creator._id) {
            navigate("/profile");
          } else {
            navigate(`/user/${post.creator._id}`);
          }
        }}
      >
        <img
          className="rounded-full w-10 object-cover aspect-square"
          src={
            post.creator.profile_image ||
            `https://api.dicebear.com/9.x/big-smile/svg?seed=${post.creator.userName}&backgroundColor=c0aede`
          }
        />
        <p className="text-white">@{post.creator.userName}</p>
      </div>
      <div className="text-white text-xl">{post.content}</div>
      <div className="flex flex-col">
        {post.media.map((image, index) => {
          return <img src={image} key={index} alt="" className="w-full" />;
        })}
      </div>
      <div className="flex flex-row-reverse justify-center items-center px-5">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation(); // Prevents event from propagating to parent elements
            handleLike(post._id);
          }}
          className="px-5 py-2 rounded-2xl text-white"
        >
          <img src={!isLiked ? WhiteHeart : RedHeart} className="w-10" />
        </button>
        <p className="text-white text-2xl">{likeNo} Likes</p>
      </div>
    </div>
  );
};

export default Post;
