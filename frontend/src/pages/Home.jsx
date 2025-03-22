import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";
import NavBar from "../components/NavBar";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const response = await axios.get("/api/posts/feed");
      setPosts(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("error fetching user data", error);
      if (error.response?.status == 401) navigate("/login");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  if (posts.length == 0)
    return <div className="w-screen h-screen text-white">HOME PAGE</div>;
  return (
    <>
      <NavBar />
      <div className="flex justify-center mt-5 w-full h-fit text-white">
        <div className="bg-neutral-900 mb-36 w-1/2">
          {posts.map((post, index) => {
            return <Post key={index} post={post} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
