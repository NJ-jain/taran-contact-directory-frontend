import apiInstance from './axiosInstance';
import { getBackendUrl } from './apiConfig';

const getUserBaseUrl = () => `${getBackendUrl()}/user`;

export const getUser = async () => {
    const response = await apiInstance.get(`${getUserBaseUrl()}/users`);
    return response.data;
};

export const updateUser = async (userData) => {
    let data;

    if (userData.bannerImage) {
        const formData = new FormData();
        if (userData.name) formData.append('name', userData.name);
        if (userData.aboutUs) formData.append('aboutUs', userData.aboutUs);
        if (userData.category) formData.append('category', userData.category);
        formData.append('bannerImage', userData.bannerImage);
        data = formData;
    } else {
        data = userData;
    }

    const response = await apiInstance.put(`${getUserBaseUrl()}/users`, data);
    return response.data;
};

export const approvalRequestApi = async () => {
    const response = await apiInstance.post(`${getUserBaseUrl()}/admin-approval-request`);
    return response.data;
};