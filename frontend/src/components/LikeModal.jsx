import { motion, AnimatePresence } from "framer-motion";

import React from "react";
import UserCardV2 from "./UserCardv2";

const LikeModal = ({ isOpen, onClose, list }) => {
  const handleBackgroundClick = (e) => {
    if (e.target == e.currentTarget) {
      onClose();
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="z-30 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          onClick={handleBackgroundClick}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.05, ease: "easeInOut" }}
            className="flex flex-col gap-5 bg-neutral-800 p-5 rounded-md w-[600px] h-[700px] overflow-y-scroll your-container"
          >
            {list &&
              list.map((user, index) => {
                console.log(user);

                return (
                  <UserCardV2 key={user.usersLiked._id} user={user.usersLiked} />
                );
              })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LikeModal;
