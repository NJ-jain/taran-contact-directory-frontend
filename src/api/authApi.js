import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/auth`;

export const registerUser = async (userData) => {
    const response = await axios.post(`${BASE_URL}/register`, userData, {
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