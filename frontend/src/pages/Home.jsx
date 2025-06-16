import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Post from "../components/Post";
import NavBar, { MobileLogoTop, MobileNavBar } from "../components/NavBar";
import api from "../utils/axios-api.js";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      // const response = await axios.get("/api/posts/feed");
      const response = await api.get("/posts/feed");
      setPosts(response.data.data);
      // //console.log(response.data.data);
    } catch (error) {
      // console.error("error fetching user data", error);
      // if (error.response?.status == 401) navigate("/login");
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <NavBar />
      <MobileNavBar />
      <MobileLogoTop />
      <div className="flex justify-center mt-[50px] md:mt-[70px] w-full h-fit text-white">
        <div className="bg-neutral-900 mb-36 rounded-xl w-full md:w-1/2">
          {/* if posts length is 0 show now post follow someone */}
          {posts.length === 0 && (
            <div className="flex flex-col justify-center items-center h-96">
              <h1 className="mb-4 font-bold text-2xl">No Posts Yet</h1>
              <p className="text-lg">Follow someone to see their posts!</p>
            </div>
          )}
          {posts.map((post, index) => {
            return <Post key={post._id} post={post} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Home;
