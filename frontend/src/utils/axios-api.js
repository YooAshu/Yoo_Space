import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops and don't retry refresh endpoint
        if (
            error.response?.status === 401 && 
            !originalRequest._retry &&
            !originalRequest.url?.includes('/refreshToken')
        ) {
            originalRequest._retry = true;
            console.log("Token expired. Attempting to refresh...");

            try {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/refreshToken`,
                    {},
                    { withCredentials: true }
                );

                console.log("✅ Token refreshed, retrying request");
                return api(originalRequest);
                
            } catch (refreshError) {
                console.error("❌ Session expired. Redirecting to login...");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;