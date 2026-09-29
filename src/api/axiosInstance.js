import axios from "axios";
import { getBackendUrl } from "./apiConfig";

const apiInstance = axios.create({
    baseURL: getBackendUrl(),
    timeout: 15000,
});

// Request interceptor to attach authentication token
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authorization");
        if (token) {
            config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling without infinite refresh loops
apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath.includes('/login') || 
                               currentPath.includes('/register') || 
                               currentPath.includes('/forgot-password');

            // Only redirect if a previously authenticated user's session expired on a protected page
            if (!isAuthPage) {
                localStorage.removeItem("authorization");
                if (currentPath.startsWith('/admin')) {
                    localStorage.removeItem("adminAuthorization");
                    window.location.href = "/admin/login";
                } else {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiInstance;
