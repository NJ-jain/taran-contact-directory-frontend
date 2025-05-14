import apiInstance from './axiosInstance'; // Import the axios instance

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/user`;

export const getUser = async () => {
    const response = await apiInstance.get(`${BASE_URL}/users`);
    return response.data;
};
export const updateUser = async (userData) => {
    let data;
    let headers = {};

    if (userData.bannerImage) {
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('bannerImage', userData.bannerImage); // Append the File object directly
        data = formData;
        headers['Content-Type'] = 'multipart/form-data';
    } else {
        data = userData;
    }

    const response = await apiInstance.put(`${BASE_URL}/users`, data, { headers });
    return response.data;
};


export const approvalRequestApi = async () => {
    await apiInstance.post(`${BASE_URL}/admin-approval-request`);
}