import React from "react";
import Add from "../assets/add-svgrepo-com.svg";

const AddPostButton = ({openAddPostModal}) => {


  return (
    <button
      type="button"
      onClick={openAddPostModal}
      className="bottom-[15px] left-[50%] fixed bg-gradient-to-r from-[#b200fd] to-[#2d04fc] shadow-[0px_0px_20px_1px_#8f01fc] p-0 rounded-full translate-x-[-50%]"
    >
      <img src={Add} alt="add" className="w-16" />
    </button>
  );
};

export default AddPostButton;
