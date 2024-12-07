import axios from 'axios';

export const registerUser = async (userData) => {
    const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

// New loginUser function
export const loginUser = async (userData) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', userData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};