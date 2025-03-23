import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import { useForm } from "react-hook-form";
import Comment from "../components/Comment";
import LikeModal from "../components/LikeModal";
import NavBar from "../components/NavBar";

const PostPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { postId } = useParams();
  const [isLikeModalOpen, setLikeModalOpen] = useState(false);
  const [likesList, setlikesList] = useState(null);

  const openLikeModal = () => setLikeModalOpen(true);
  const closeLikeModal = () => setLikeModalOpen(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const getPost = async () => {
    try {
      const postResponse = await axios.get(`/api/posts/post/${postId}`);
      console.log(postResponse.data.data[0]);

      setPost(postResponse.data.data[0]);
    } catch (error) {
      console.error("error", error);
    }
  };

  const getWhoLiked = async () => {
    try {
      const response = await axios.get(`/api/posts/likes-on/${postId}`);
      setlikesList(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("error", error);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get(`/api/posts/comments/${postId}`);
      console.log(response.data.data);
      setComments(response.data.data);
    } catch (error) {
      console.error("erroe", error);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
    getWhoLiked();
  }, []);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `/api/posts/comment-on/${postId}`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log("check", response.data.data);
      setComments((prev) => [response.data.data, ...prev]);
      setPost((prevPost) => ({
        ...prevPost,
        no_of_comment: (prevPost?.no_of_comment || 0) + 1,
      }));

      reset();
    } catch (error) {
      console.error(error);
    }
  };

  if (!post) return <div className="w-full h-screen text-white">HOME PAGE</div>;
  else {
    return (
      <div className="flex flex-col justify-start items-center w-full h-max min-h-screen">
        <NavBar />
        <div className="w-1/2">
          <Post post={post} modalOpen={openLikeModal} />
        </div>

        {/* comment */}

        <div className="w-1/2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex justify-center items-center gap-10 w-full h-full"
          >
            <input
              placeholder="write comment"
              {...register("content")}
              className="bg-transparent p-[10px] border border-[#717171] rounded-[25px] w-4/5 text-white"
            />

            <input
              type="submit"
              value="Comment"
              className="bg-white px-4 py-2 rounded-full text-black"
            />
          </form>
        </div>

        <div className="flex flex-col gap-4 my-9 w-1/2">
          {comments.length > 0 &&
            comments.map((comment, index) => {
              return <Comment key={comment._id} comment={comment} />;
            })}
        </div>
        <LikeModal
          isOpen={isLikeModalOpen}
          onClose={closeLikeModal}
          list={likesList}
        />
      </div>
    );
  }
};

export default PostPage;
