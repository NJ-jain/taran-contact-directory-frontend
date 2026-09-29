import axios from 'axios';
import { getBackendUrl } from './apiConfig';

const adminAxios = axios.create({
    timeout: 15000,
});

// Add interceptor to add admin token and dynamic base URL
adminAxios.interceptors.request.use((config) => {
    config.baseURL = `${getBackendUrl()}/admin`;
    const token = localStorage.getItem('adminAuthorization');
    if (token) {
        config.headers.AdminAuthorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle token expiration
adminAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('adminAuthorization');
            if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getAllUsers = async () => {
    try {
        const response = await adminAxios.get('/get-all-users');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: error.message || 'Failed to fetch users' };
    }
}; 

export const getUserMembers = async (userId) => {
    try {
        const response = await adminAxios.get(`/get-user-members/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: error.message || 'Failed to fetch user members' };
    }
}; 

export const approveMember = async (memberId) => {
    try {
        const response = await adminAxios.put(`/approve-member/${memberId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: error.message || 'Failed to update approval status' };
    }
}; 