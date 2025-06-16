import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import generateGradient from "../utils/generateGradient.js";
import { ToastContainer, toast } from "react-toastify";
import api from "../utils/axios-api.js";
import NavBar, { MobileLogoTop, MobileNavBar } from "../components/NavBar.jsx";

const UpdateProfile = () => {
  const [userData, setUserData] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/users/current-user");
      const user = response.data.data;
      setUserData(user);
    } catch (error) {
      console.error("error fetching user data", error);
    }
  };

  // Register file inputs with the correct handlers
  const profileImageRegister = register("profileImage");
  const coverImageRegister = register("coverImage");

  const onSubmit = async (data) => {
    setisSubmitting(true);
    const toastId = toast.loading("Updating profile...");
    //console.log("Form data:", data);
    //console.log("userdata",userData);
    const formData = new FormData();
    if (data.userName != userData.userName) {
      formData.append("userName", data.userName);
    }
    if (data.fullName != userData.fullName)
      formData.append("fullName", data.fullName);
    if (data.bio != userData.bio) formData.append("bio", data.bio);

    // Check if files exist before appending
    if (data.profileImage && data.profileImage.length > 0) {
      //console.log("Profile image found:", data.profileImage[0]);
      formData.append("profileImage", data.profileImage[0]);
    }

    if (data.coverImage && data.coverImage.length > 0) {
      //console.log("Cover image found:", data.coverImage[0]);
      formData.append("coverImage", data.coverImage[0]);
    }
    for (let pair of formData.entries()) {
      //console.log(pair[0], pair[1]); // Prints key-value pairs
    }

    try {
      await api.patch("/users/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.update(toastId, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 500, // Closes automatically in 3s
      });
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.update(toastId, {
        render: error.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    } finally {
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  if (!userData) {
    return (
      <div className="relative flex justify-center items-center w-screen min-h-screen">
        <div className="flex flex-col gap-5 bg-zinc-950 rounded-lg w-[600px] min-h-[700px] text-white">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center w-screen min-h-screen">
      <NavBar />
      <MobileNavBar />
      <MobileLogoTop />
      <ToastContainer autoClose={1500} theme="dark" />
      <div className="relative flex flex-col gap-5 bg-[rgb(16,16,16)] rounded-lg w-[600px] min-h-[700px] overflow-hidden">
        {/* cover image */}
        <div
          className="relative w-full h-32"
          style={{ background: generateGradient(userData.userName) }}
        >
          {(coverPreview || userData.cover_image) && (
            <img
              className="w-full h-full object-cover"
              src={coverPreview || userData.cover_image}
              alt="cover image"
            />
          )}

          {/* button for cover*/}
          <label
            htmlFor="cover-upload"
            className="right-3 bottom-3 absolute bg-white px-3 rounded-3xl text-base cursor-pointer"
          >
            Change Cover Image
          </label>
        </div>

        {/* profile image */}
        <div className="top-16 left-56 absolute flex flex-col items-center gap-2 w-36 h-32">
          <img
            className="rounded-full w-32 h-full object-cover aspect-square"
            src={
              profilePreview ||
              userData.profile_image ||
              `https://api.dicebear.com/9.x/big-smile/svg?seed=${userData.userName}&backgroundColor=c0aede`
            }
            alt="profile"
          />

          {/* button for profile*/}
          <label
            htmlFor="profile-upload"
            className="px-3 border border-white rounded-3xl text-white text-sm cursor-pointer"
          >
            Change Profile Pic
          </label>
        </div>

        {/* form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bottom-14 absolute flex flex-col justify-center items-center gap-10 w-full"
        >
          <div className="flex flex-col items-center gap-2 w-full">
            <label htmlFor="userName" className="mb-1 w-3/4 text-white">
              User name
            </label>
            <input
              defaultValue={userData.userName}
              {...register("userName")}
              className="bg-transparent p-[10px] border border-[#717171] rounded-[25px] w-4/5 text-white"
            />
          </div>

          <div className="flex flex-col items-center gap-2 w-full">
            <label htmlFor="fullName" className="mb-1 w-3/4 text-white">
              Full Name
            </label>
            <input
              defaultValue={userData.fullName}
              {...register("fullName")}
              className="bg-transparent p-[10px] border border-[#717171] rounded-[25px] w-4/5 text-white"
            />
          </div>

          <div className="flex flex-col items-center gap-2 w-full">
            <label htmlFor="Bio" className="mb-1 w-3/4 text-white">
              Bio
            </label>
            <input
              defaultValue={userData.bio || ""}
              {...register("bio")}
              className="bg-transparent p-[10px] border border-[#717171] rounded-[25px] w-4/5 text-white"
            />
          </div>

          {/* File inputs - properly registered with React Hook Form */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="cover-upload"
            name={coverImageRegister.name}
            onChange={(e) => {
              // Handle both React Hook Form registration and preview
              coverImageRegister.onChange(e); // This ensures React Hook Form gets the file
              if (e.target.files[0]) {
                setCoverPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            ref={coverImageRegister.ref}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="profile-upload"
            name={profileImageRegister.name}
            onChange={(e) => {
              // Handle both React Hook Form registration and preview
              profileImageRegister.onChange(e); // This ensures React Hook Form gets the file
              if (e.target.files[0]) {
                setProfilePreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            ref={profileImageRegister.ref}
          />
          <input
            type="submit"
            value={isSubmitting ? "Updating..." : "Update"}
            disabled={isSubmitting}
            className="bg-white px-4 py-2 rounded-full text-black cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
