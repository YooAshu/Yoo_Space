import axios from "axios";
import React,{useContext} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post("/api/users/login", data, {
        withCredentials: true,
      });

      console.log(response.data);
      // alert("login successful");
      localStorage.setItem("userId", response.data.data.user._id);
      navigate("/profile");
      toast("login successful");
    } catch (error) {
      console.error(error);
      toast(error.response.data.message);
      // alert(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <ToastContainer autoClose={1500} theme="dark"/>
      <div className="bg-zinc-800 rounded-2xl w-80 h-96">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-10 w-full h-full"
        >
          <input
            placeholder="email"
            {...register("email")}
            className="bg-transparent p-[10px] border border-[#717171] rounded-[25px] w-4/5 text-white"
          />
          <input
            placeholder="password"
            type="password"
            {...register("password")}
            className="bg-transparent p-[10px] border border-[#717171] rounded-[25px] w-4/5 text-white"
          />
          <input
            type="submit"
            className="bg-white px-4 py-2 rounded-full text-black"
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
