import axios from 'axios';
import apiInstance from './axiosInstance';
import { getBackendUrl } from './apiConfig';

const getMembersBaseUrl = () => `${getBackendUrl()}/members`;

export const createMember = async (memberData) => {
    const response = await apiInstance.post(getMembersBaseUrl(), memberData);
    return response.data;
};

export const getAllMembers = async () => {
    const response = await axios.get(getMembersBaseUrl());
    return response.data;
};

export const getMember = async (memberId) => {
    const response = await axios.get(`${getMembersBaseUrl()}/${memberId}`);
    return response.data;
};

export const updateMember = async (memberId, memberData) => {
    const response = await apiInstance.put(`${getMembersBaseUrl()}/${memberId}`, memberData);
    return response.data;
};

export const searchMembers = async (searchQuery) => {
    const safeParam = encodeURIComponent(searchQuery || '');
    const response = await axios.get(`${getMembersBaseUrl()}/search?q=${safeParam}`);
    return response.data;
};
