import axios from 'axios';
import { getBackendUrl } from './apiConfig';

const getAuthBaseUrl = () => `${getBackendUrl()}/auth`;
const getAdminBaseUrl = () => `${getBackendUrl()}/admin`;

export const registerUser = async (userData) => {
    const response = await axios.post(`${getAuthBaseUrl()}/register`, userData);
    return response.data;
};

export const registerAdminUser = async (userData) => {
    const headers = { 'Content-Type': 'application/json' };
    if (userData.adminSecretKey) {
        headers['x-admin-secret-key'] = userData.adminSecretKey;
    }
    const response = await axios.post(`${getAdminBaseUrl()}/create-admin`, userData, { headers });
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${getAuthBaseUrl()}/login`, userData);
    return response.data;
};

export const loginUserAdmin = async (userData) => {
    const response = await axios.post(`${getAdminBaseUrl()}/admin-login`, userData);
    return response.data;
};

// Forgot password - send OTP
export const forgotPassword = async (email) => {
    const response = await axios.post(`${getAuthBaseUrl()}/forgot-password`, { email });
    return response.data;
};

// Verify OTP and reset password
export const resetPassword = async (resetData) => {
    const response = await axios.post(`${getAuthBaseUrl()}/verify-otp`, resetData);
    return response.data;
};

// Send OTP (alternative endpoint)
export const sendOTP = async (email) => {
    const response = await axios.post(`${getAuthBaseUrl()}/send-otp`, { email });
    return response.data;
};

// Send Phone OTP for community members
export const sendPhoneOtpApi = async (phoneNumber) => {
    const response = await axios.post(`${getAuthBaseUrl()}/phone/send-otp`, { phoneNumber });
    return response.data;
};

// Verify Phone OTP for community members
export const verifyPhoneOtpApi = async ({ phoneNumber, otp }) => {
    const response = await axios.post(`${getAuthBaseUrl()}/phone/verify-otp`, { phoneNumber, otp });
    return response.data;
};