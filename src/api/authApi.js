import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/auth`;
const BASE_URL_ADMIN = `${process.env.REACT_APP_BACKEND_URL}/admin`;

export const registerUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}/register`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};
export const registerAdminUser = async (userData) => {
    const response = await axios.post(`${BASE_URL_ADMIN}/create-admin`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

// New loginUser function
export const loginUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}/login`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};
export const loginUserAdmin = async (userData) => {
    const response = await axios.post(`${BASE_URL_ADMIN}/admin-login`, userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};