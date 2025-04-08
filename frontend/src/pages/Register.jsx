import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import YooHub from "../assets/yoohub.png"
import YooSpace from "../assets/yoospace.png"

const Register = () => {
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
      const response = await axios.post("/api/users/register", data);
      console.log(response.data);
      toast("Registration successful!");
      // alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast(error.response.data.message);
      // alert(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-9 w-screen h-screen">
      <ToastContainer autoClose={1500} theme="dark" />
      <div className="w-1/4">
              <img src={YooSpace} alt="yoohub" />
            </div>
      <div className="bg-zinc-800 rounded-2xl w-96 h-[500px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-10 w-full h-full"
        >
          <input
            placeholder="user name"
            {...register("userName")}
            className="bg-transparent p-[10px] border border-[#717171] rounded-[25px] w-4/5 text-white"
          />
          <input
            placeholder="full name"
            {...register("fullName")}
            className="bg-transparent p-[10px] border border-[#717171] rounded-[25px] w-4/5 text-white"
          />
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

      <div
        onClick={() => navigate("/login")}
        className="font-bold text-white cursor-pointer"
      >
        Login
      </div>
    </div>
  );
};

export default Register;
