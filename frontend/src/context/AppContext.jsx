import { createContext, useState } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [followingNo, setFollowingNo] = useState(0);

    return (
        <AppContext.Provider value={{ followingNo, setFollowingNo}}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider; // Default export for AppProvider
