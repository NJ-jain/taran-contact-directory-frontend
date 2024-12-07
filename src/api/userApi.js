import apiInstance from './axiosInstance'; // Import the axios instance

export const getUser = async () => {
    const response = await apiInstance.get('http://localhost:5000/api/user/users');
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

    const response = await apiInstance.put('http://localhost:5000/api/user/users', data, { headers });
    return response.data;
};