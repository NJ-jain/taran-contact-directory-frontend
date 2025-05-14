import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/admin`;

// Create axios instance with auth header
const adminAxios = axios.create({
    baseURL: BASE_URL,
});

// Add interceptor to add admin token
adminAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminAuthorization');
    if (token) {
        config.headers.AdminAuthorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle token expiration
adminAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('adminAuthorization');
        }
        return Promise.reject(error);
    }
);

export const getAllUsers = async () => {
    try {
        const response = await adminAxios.get('/get-all-users');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}; 

export const getUserMembers = async (userId) => {
    try {
        const response = await adminAxios.get(`/get-user-members/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}; 

export const approveMember = async (memberId) => {
    try {
        const response = await adminAxios.put(`/approve-member/${memberId}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}; 