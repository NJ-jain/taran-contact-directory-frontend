import apiInstance from './axiosInstance';

const API_URL = 'http://localhost:5000/api/members';

export const createMember = async (memberData) => {
    const response = await apiInstance.post(API_URL, memberData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const getAllMembers = async () => {
    const response = await apiInstance.get(API_URL);
    return response.data;
};

export const getMember = async (memberId) => {
    const response = await apiInstance.get(`${API_URL}/${memberId}`);
    return response.data;
};

export const updateMember = async (memberId, memberData) => {
    const response = await apiInstance.put(`${API_URL}/${memberId}`, memberData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const searchMembers = async (searchQuery) => {
    const response = await apiInstance.get(`${API_URL}/search?q=${searchQuery}`);
    return response.data;
};
