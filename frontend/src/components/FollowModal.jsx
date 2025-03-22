import { motion, AnimatePresence } from "framer-motion";

import React from "react";
import UserCard from "./UserCard";

const FollowModal = ({ isOpen, onClose, list }) => {
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
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          onClick={handleBackgroundClick}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.05, ease: "easeInOut" }}
            className="flex flex-col gap-5 bg-neutral-800 p-5 rounded-md w-[600px] min-h-[700px]"
          >
            {list &&
              list.map((user, index) => {
                console.log(user);

                return (
                  <UserCard key={user._id} user={user} showButton={false} />
                );
              })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowModal;
