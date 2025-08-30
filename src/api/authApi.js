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
    try {
        const response = await axios.post(`${BASE_URL}/login`, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with error status
            throw new Error(`Login failed: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            // Request was made but no response received (CORS issue)
            throw new Error('Network error: Unable to reach the server. Please check your connection or contact support.');
        } else {
            // Something else happened
            throw new Error(`Login error: ${error.message}`);
        }
    }
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
    try {
        const response = await axios.post(`${BASE_URL}/forgot-password`, { email }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Forgot password failed: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to reach the server. Please check your connection or contact support.');
        } else {
            throw new Error(`Forgot password error: ${error.message}`);
        }
    }
};

// Verify OTP and reset password
export const resetPassword = async (resetData) => {
    try {
        const response = await axios.post(`${BASE_URL}/verify-otp`, resetData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Reset password failed: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to reach the server. Please check your connection or contact support.');
        } else {
            throw new Error(`Reset password error: ${error.message}`);
        }
    }
};

// Send OTP (alternative endpoint)
export const sendOTP = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/send-otp`, { email }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Send OTP failed: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Network error: Unable to reach the server. Please check your connection or contact support.');
        } else {
            throw new Error(`Send OTP error: ${error.message}`);
        }
    }
};