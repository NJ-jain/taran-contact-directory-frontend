import axios from "axios";

axios.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem("authorization");
        config.headers['authorization'] = token;
        if (process.env.NEXT_PUBLIC_ENV === 'local')
            config.headers['authorization'] = localStorage.getItem("authorization");
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        if (error?.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axios;
