// Centralized API Configuration
export const getBackendUrl = () => {
    const envUrl = process.env.REACT_APP_BACKEND_URL;
    if (envUrl) {
        return envUrl.replace(/\/$/, '');
    }
    return process.env.NODE_ENV === 'production'
        ? 'https://taran-contact-directory-backend.vercel.app/api'
        : 'http://localhost:5000/api';
};

const API_CONFIG = {
    BASE_URL: getBackendUrl(),
    TIMEOUT: 15000,
};

export default API_CONFIG;
