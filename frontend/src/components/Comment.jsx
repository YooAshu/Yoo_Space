import React, { useContext, useEffect, useState } from "react";
import RedHeart from "../assets/red-heart.png";
import WhiteHeart from "../assets/white-heart.png";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import api from "../utils/axios-api";

const Comment = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked|| false);
  const [likeNo, setLikeNo] = useState(comment.no_of_like);

  const navigate = useNavigate();

  // useEffect(() => {
  //   checkIsLiked(comment._id);
  // }, []);

  // const checkIsLiked = async (id) => {
  //   const response = await api.get(`/posts/comment/is-liked/${id}`);
  //   setIsLiked(response.data?.liked);
  // };

  const handleLike = async (id) => {
    if (!isLiked) {
      await api.patch(`/posts/comment/like/${id}`);
      setIsLiked(true);
      setLikeNo((prev) => prev + 1);
    } else {
      await api.patch(`/posts/comment/unlike/${id}`);
      setIsLiked(false);
      setLikeNo((prev) => prev - 1);
    }
  };

  const { currentUserByToken } = useContext(AppContext);
  const loggedInUserId = currentUserByToken?.userId;

  return (
    <div className="flex flex-col gap-3 bg-neutral-800 p-3 pt-1 md:pt-3 rounded-2xl w-full text-[12px] text-white md:text-[16px]">
      <div className="flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            if (loggedInUserId == comment.user._id) {
              navigate("/profile");
            } else {
              navigate(`/user/${post.creator._id}`);
            }
          }}
        >
          <img
            className="rounded-full w-6 md:w-8 object-cover aspect-square"
            src={
              comment.user.profile_image ||
              `https://api.dicebear.com/9.x/big-smile/svg?seed=${comment.user.userName}&backgroundColor=c0aede`
            }
          />
          <p>@{comment.user.userName}</p>
        </div>
        <div className="flex flex-row-reverse items-center">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation(); // Prevents event from propagating to parent elements
              handleLike(comment._id);
            }}
            className="px-5 py-2 text-white"
          >
            <img src={!isLiked ? WhiteHeart : RedHeart} className="w-6 md:w-10" />
          </button>
          <p className="text-[12px] text-white md:text-2xl">{likeNo} Likes</p>
        </div>
        {/* <p className="mr-5">{comment.no_of_like}</p> */}
      </div>
      <div className="md:ml-8">{comment.content}</div>
    </div>
  );
};

export default Comment;
