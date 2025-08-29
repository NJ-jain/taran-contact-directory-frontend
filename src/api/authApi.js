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

// Forgot password - send OTP
export const forgotPassword = async (email) => {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { email }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

// Verify OTP and reset password
export const resetPassword = async (resetData) => {
    const response = await axios.post(`${BASE_URL}/verify-otp`, resetData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

// Send OTP (alternative endpoint)
export const sendOTP = async (email) => {
    const response = await axios.post(`${BASE_URL}/send-otp`, { email }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};