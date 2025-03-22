import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import Upload from "../assets/upload.png";
import Arrow from "../assets/arrow.svg";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AddPostModal = ({ isOpen, onClose, user }) => {
  const [isSubmitting, setisSubmitting] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      images: [], // Ensure images start as an empty array
    },
  });
  const images = watch("images", []); // Track selected images

  const handleBackgroundClick = (e) => {
    if (e.target == e.currentTarget) {
      onClose();
      setValue("images", []); // ✅ Clear images after upload
      setValue("content", ""); // ✅ Clear text input
    }
  };

  // Handle Image Drop
  const onDrop = (acceptedFiles) => {
    if (images.length + acceptedFiles.length > 3) {
      toast.error("You can only upload up to 3 images!");
      return;
    }
    setValue("images", [...images, ...acceptedFiles], { shouldValidate: true });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"], // JPEG images
      "image/png": [".png"], // PNG images
      "image/gif": [".gif"], // GIF images
      "image/webp": [".webp"], // WebP images
      "image/svg+xml": [".svg"], // SVG images
      "image/bmp": [".bmp"], // BMP images
      "image/tiff": [".tiff", ".tif"], // TIFF images
      "image/x-icon": [".ico"], // ICO icons
      "image/vnd.microsoft.icon": [".ico"], // Alternative ICO MIME type
      "image/heic": [".heic"], // HEIC images (High Efficiency Image Format)
      "image/heif": [".heif"], // HEIF images (High Efficiency Image Format)
      "image/avif": [".avif"], // AVIF images
      "image/apng": [".apng"], // Animated PNG images
    },
    multiple: true,
    onDrop,
  });

  // api call
  const onSubmit = async (data) => {
    // console.log("Form Data:", data);
    setisSubmitting(true);
    const toastId = toast.loading("Uploading Post...");
    const formData = new FormData();
    if (data.content != "") formData.append("content", data.content);
    if (data.images && data.images.length > 0) {
      // console.log("Profile image found:", data.images);
      data.images.forEach((image) => {
        formData.append("media", image); // Same key for all images
      });
    }
    // Logging FormData
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    if (data.content == "" && data.images.length == 0) {
      toast.update(toastId, {
        render: "post fields are empty",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      setisSubmitting(false);
      return;
    }
    try {
      await axios.post("/api/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.update(toastId, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 500, // Closes automatically in 3s
      });
      //   navigate("/profile");
      onClose();
      // setData({ images: [], content: "" }); // Reset state
      setValue("images", []); // ✅ Clear images after upload
      setValue("content", ""); // ✅ Clear text input
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

  //   arrow logic
  const [imageIndex, setImageIndex] = useState(0);

  const glass =
    "bg-transparent shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[20px] rounded-[10px] border border-[rgba(255,255,255,0.18)] absolute bottom-4 p-5 rounded-[50px]";

  // api call

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          onClick={handleBackgroundClick}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.05, ease: "easeInOut" }}
            className="flex flex-col bg-neutral-800 rounded-md w-[950px] h-[600px] overflow-hidden"
          >
            <ToastContainer autoClose={1500} theme="dark" />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex space-y-4 rounded-md w-full h-full"
            >
              <div className="relative bg-neutral-900 w-[600px] h-[600px]">
                {/* Image Previews */}
                {images.length > 0 && (
                  <div
                    className={` relative ${
                      images.length == 0 ? "" : "w-full h-full"
                    }`}
                  >
                    <button
                      disabled={imageIndex == 0}
                      type="button"
                      onClick={() =>
                        setImageIndex((prevIndex) => prevIndex - 1)
                      }
                      className="top-2/4 z-[1] absolute"
                    >
                      <img src={Arrow} alt="arrow" className="w-12" />
                    </button>
                    <button
                      disabled={imageIndex == images.length - 1}
                      type="button"
                      onClick={() =>
                        setImageIndex((prevIndex) => prevIndex + 1)
                      }
                      className="top-2/4 right-0 z-[1] absolute"
                    >
                      <img
                        src={Arrow}
                        alt="arrow"
                        className="w-12"
                        style={{ transform: "rotate(-180deg)" }}
                      />
                    </button>
                    <div className="relative h-full">
                      <img
                        src={URL.createObjectURL(images[imageIndex])}
                        alt={`preview`}
                        className="rounded-md w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {/* Dropzone for Images */}
                <div
                  {...getRootProps()}
                  className={`flex flex-col justify-center items-center gap-8 w-full text-center cursor-pointer ${
                    images.length == 0 ? "h-full" : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  {/* <div className="flex flex-col justify-center items-center"> */}
                  {images.length == 0 && (
                    <img src={Upload} alt="upload" className="w-[200px]" />
                  )}

                  <p
                    className={`text-white ${images.length == 0 ? "" : glass}`}
                  >
                    Drag & drop images here , or click to select
                  </p>
                  {/* </div> */}
                </div>
              </div>
              {/* Caption Input */}
              <div className="relative w-[350px]">
                <div className="flex items-center gap-2 p-2">
                  <img
                    className="rounded-full w-10 object-cover aspect-square"
                    src={
                      user.img ||
                      `https://api.dicebear.com/9.x/big-smile/svg?seed=${user.userName}&backgroundColor=c0aede`
                    }
                  />
                  <p className="text-white">@{user.userName}</p>
                </div>
                <textarea
                  {...register("content")}
                  placeholder="Enter caption"
                  className="bg-transparent mt-4 px-5 py-2 border border-none rounded-md outline-none focus:ring-0 w-full text-white leading-8 resize-none"
                />

                {/* Submit Button */}
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="right-0 bottom-1 absolute bg-white m-5 px-5 py-2 rounded-3xl font-bold text-black"
                >
                  {isSubmitting ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPostModal;
