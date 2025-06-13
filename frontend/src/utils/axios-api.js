import axios from "axios";

// Axios instance with cookies
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // Important for sending cookies
});

// Interceptor to refresh token on 401 error
api.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        if (error.response?.status === 401) {
            //console.log("Token expired. Attempting to refresh...1");

            try {
                // Call refresh token API
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/refreshToken`,
                    {},
                    { withCredentials: true }
                );

                // Retry the original request
                return api(error.config);
            } catch (refreshError) {
                //console.log("Token expired. Attempting to refresh...2");
                //console.error("Session expired. Redirecting to login...");
                window.location.href = "/login"; // Redirect to login
            }
        }
        return Promise.reject(error);
    }
);

export default api;
