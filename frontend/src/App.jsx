import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import DiscoverPeople from "./pages/DiscoverPeople";
import UpdateProfile from "./pages/UpdateProfile"
import UserProfile from "./pages/UserProfile";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import DirectMessage from "./pages/DirectMessage";

import AllChats from "./pages/AllChats";
import GroupMessage from "./pages/GroupMessage";
function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/discover-people",
      element: <DiscoverPeople/>,
    },
    {
      path: "/profile/update",
      element: <UpdateProfile/>,
    },
    {
      path: "/user/:userId",
      element: <UserProfile/>,
    },
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "/post/:postId",
      element: <PostPage/>,
    },
    {
      path: "/direct/:targetId",
      element: <DirectMessage/>,
    },
    {
      path: "/group/:conversationId",
      element: <GroupMessage/>,
    },
    {
      path:"/all-chats",
      element:<AllChats/>
    }
  ]);

  return <RouterProvider router={router}/>;
}

export default App;
