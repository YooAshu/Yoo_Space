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
  ]);

  return <RouterProvider router={router}/>;
}

export default App;
