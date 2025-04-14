import { createContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [followingNo, setFollowingNo] = useState(0);
  
  const showToast = ({ message, type = "success", id = null }) => {
    toast(message, {
      type,
      toastId: id || undefined,
    });
  };

  const showLoadingToast = ({ message, id }) => {
    toast.loading(message, {
      toastId: id,
    });
  };

  const updateToast = ({ id, message, type = "success", autoClose = 1500 }) => {
    toast.update(id, {
      render: message,
      type,
      isLoading: false,
      autoClose,
    });
  };

  const dismissToast = (id) => {
    toast.dismiss(id);
  };

  return (
    <AppContext.Provider
      value={{
        followingNo,
        setFollowingNo,
        showToast,
        showLoadingToast,
        updateToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider; // Default export for AppProvider
