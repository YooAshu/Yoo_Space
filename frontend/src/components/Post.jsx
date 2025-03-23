import axios from "axios";
import React, { useEffect, useState } from "react";
import RedHeart from "../assets/red-heart.png";
import WhiteHeart from "../assets/white-heart.png";
import { useLocation, useNavigate } from "react-router-dom";
import Arrow from "../assets/arrow.svg";
const Post = ({ post, modalOpen = undefined }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLiked, setIsLiked] = useState(false);
  const [likeNo, setLikeNo] = useState(post.no_of_like);
  const [imageIndex, setImageIndex] = useState(0);

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

  const handlePostClick = () => {
    const postUrl = `/post/${post._id}`;
    if (location.pathname !== postUrl) {
      navigate(postUrl);
    }
  };

  return (
    <div
      className="flex flex-col gap-6 bg-black m-5 p-3 rounded-3xl w-auto min-h-52"
      onClick={() => {
        handlePostClick();
      }}
    >
      <div
        className="flex items-center gap-2"
        onClick={(event) => {
          event.stopPropagation();
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
      <div className="relative flex">
        {post.media.length > 0 && (
          <>
            {post.media.length > 1 && (
              <>
                <button
                  disabled={imageIndex == 0}
                  type="button"
                  onClick={() => setImageIndex((prevIndex) => prevIndex - 1)}
                  className={`top-2/4 z-[1] absolute  ${
                    imageIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <img src={Arrow} alt="arrow" className="w-12" />
                </button>
                <button
                  disabled={imageIndex == post.media.length - 1}
                  type="button"
                  onClick={() => setImageIndex((prevIndex) => prevIndex + 1)}
                  className={`top-2/4 right-0 z-[1] absolute 
                ${
                  imageIndex === post.media.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                >
                  <img
                    src={Arrow}
                    alt="arrow"
                    className="w-12 op"
                    style={{ transform: "rotate(-180deg)" }}
                  />
                </button>

                {/* indicators */}

                <div className="bottom-[-5%] left-1/2 z-[1] absolute -translate-x-1/2 transform">
                  {Array(post.media.length)
                    .fill(null)
                    .map((_, index) => {
                      return (
                        <span
                          key={index}
                          className={`${
                            imageIndex == index ? "" : "opacity-50"
                          }`}
                        >
                          x
                        </span>
                      );
                    })}
                </div>
              </>
            )}

            <div className="relative h-full">
              <img
                src={post.media[imageIndex]}
                alt={`preview`}
                className="rounded-md w-full h-full object-cover"
              />
            </div>
          </>
        )}
        {/* {post.media.map((image, index) => {
          return <img src={image} key={index} alt="" className="w-full" />;
        })} */}
      </div>
      <div
        className="flex justify-around items-center px-5"
        style={{ borderTop: ".5px solid #ffffff63" }}
      >
        <div className="flex flex-row-reverse items-center">
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
          <p
            className="text-white text-2xl cursor-pointer"
            onClick={() => {
              if (modalOpen != undefined) {
                modalOpen();
              }
            }}
          >
            {likeNo} Likes
          </p>
        </div>
        <div className="text-white text-2xl">{post.no_of_comment} Comments</div>
      </div>
    </div>
  );
};

export default Post;
