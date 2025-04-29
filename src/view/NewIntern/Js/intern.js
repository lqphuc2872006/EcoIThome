// src/api.js
import axios from 'axios';

export const getAllInterns = async () => {
    try {
        const response = await axios.get(`http://localhost:8080/EcoIT/intern`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách intern:', error);
        throw error;
    }
};

export const addIntern = async (internData) => {
    try {
        const response = await axios.post(`http://localhost:8080/EcoIT/intern-add`, internData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm intern:', error);
        throw error;
    }
};