import { motion, AnimatePresence } from "framer-motion";

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
          className="z-30 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          onClick={handleBackgroundClick}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.05, ease: "easeInOut" }}
            className="flex flex-col gap-1 bg-[rgb(32,32,32)] p-2 md:p-5 rounded-md w-[95%] md:w-[600px] h-[70%] md:h-[700px] overflow-y-scroll your-container"
          >
            {list &&
              list.map((user, index) => {
                //console.log(user);

                return (
                  <UserCard key={user._id} user={user} />
                );
              })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FollowModal;
