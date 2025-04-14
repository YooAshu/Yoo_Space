import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Group from "../assets/group.png";
import api from "../utils/axios-api.js";
import { AppContext } from "../context/AppContext.jsx";
const getFollowers = async (setFollowers) => {
  try {
    const response = await api.get("/api/users/followers");
    setFollowers(response.data.data);
  } catch (error) {
    console.error("error fetching followers data", error);
  }
};
const AddGroup = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const { showToast, showLoadingToast, updateToast } = useContext(AppContext);

  // form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getFollowers(setFollowers);
  }, []);

  const avatarRegister = register("avatar");

  const onSubmit = (data) => {
    setCreatingGroup(true);
    showLoadingToast({ message: "Creating group...", id: "creating-group" });
    const formData = new FormData();
    if (data.groupName == "") {
      // alert("Group name is required");
      showToast({
        message: "Group name is required",
        type: "error",
        id: "error-toast",
      });
      return;
    }
    if (selected.length === 0) {
      // alert("Please select at least one follower");
      showToast({
        message: "Please select at least one follower",
        type: "error",
        id: "error-toast",
      });
      return;
    }
    formData.append("groupName", data.groupName);
    formData.append("invitedTo", JSON.stringify(selected));
    if (data.avatar && data.avatar.length > 0) {
      console.log("avatar found:", data.avatar[0]);
      formData.append("avatar", data.avatar[0]);
    }
    // log formData pair
    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    // send to API
    api
      .post("/api/messages/create-group", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Group created successfully", res.data);
        setCreatingGroup(false);
        setFormOpen(false);
        setAvatarPreview(null);
        setSelected([]);
        setValue("avatar", []); // ✅ Clear images after upload
        setValue("groupName", ""); // ✅ Clear text input
        // alert("Group created successfully");
        updateToast({
          id: "creating-group",
          message: "Group created successfully",
          autoClose: 1000,
        });
      })
      .catch((err) => {
        console.error("Error creating group:", err);
        updateToast({
          id: "creating-group",
          message: err.response.data.message,
          type: "error",
        });
      })
      .finally(() => {
        setCreatingGroup(false);
      });
  };

  return (
    <div className="bg-[rgb(16,16,16)] p-2 rounded-xl w-full h-auto">
      <button
        disabled={creatingGroup}
        type="button"
        onClick={() => setFormOpen(!formOpen)}
        className={`flex justify-center items-center px-5 w-full min-h-12 rounded-xl font-bold bg-white text-black text-2xl`}
      >
        Create Group +
      </button>

      <div
        className={`overflow-hidden bg-neutral-800 rounded-xl transition-all duration-300 ${
          formOpen ? "h-[500px] mt-5" : "h-0"
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-2 p-2 h-full"
        >
          <div className="flex items-center gap-2 w-full">
            <div className="relative flex flex-col items-center gap-2 w-[70px] aspect-square">
              <img
                className="opacity-40 rounded-full w-full object-cover aspect-square"
                src={avatarPreview || Group}
                alt="profile"
              />
              {/* button for profile*/}
              <label
                htmlFor="avatar-upload"
                className="top-1/2 left-1/2 z-5 absolute text-shadow-md px-3 border border-white rounded-3xl text-white text-xs -translate-x-1/2 -translate-y-1/2 cursor-pointer transform"
              >
                Edit
              </label>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              name={avatarRegister.name}
              onChange={(e) => {
                // Handle both React Hook Form registration and preview
                avatarRegister.onChange(e); // This ensures React Hook Form gets the file
                if (e.target.files[0]) {
                  setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              ref={avatarRegister.ref}
            />
            <input
              {...register("groupName", { required: true })}
              className="bg-transparent p-2 border border-[#717171] rounded-full w-full h-3/4 text-white"
              placeholder="Group Name"
            />
            {errors.groupName &&
              showToast({
                message: "Group name is required",
                type: "error",
                id: "error-toast",
              })}
          </div>

          <div className="flex-1 w-full overflow-auto your-container">
            <h2 className="text-white text-lg text-center">
              Add Your Followers
            </h2>
            <div className="flex flex-wrap justify-start items-start gap-2 mt-5 w-full h-full">
              {followers.map((follower) => (
                <div
                  key={follower._id}
                  className={`flex items-center gap-2 p-2 border border-[#717171] rounded-full cursor-pointer ${
                    selected.includes(follower._id) ? "bg-gray-600" : ""
                  }`}
                  onClick={() => {
                    if (selected.includes(follower._id)) {
                      setSelected(selected.filter((id) => id !== follower._id));
                    } else {
                      setSelected([...selected, follower._id]);
                    }
                  }}
                >
                  <img
                    src={
                      follower.profile_image ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${follower.userName}&backgroundColor=c0aede`
                    }
                    alt={follower.username}
                    className="rounded-full w-8 h-8"
                  />
                  <span className="text-white">{follower.userName}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={creatingGroup}
            type="submit"
            className="bg-white px-5 py-2 rounded-full w-max"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
