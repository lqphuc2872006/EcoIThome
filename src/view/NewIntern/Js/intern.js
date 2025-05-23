import axios from 'axios';

export const getAllInterns = async (page = 0, size = 5) => {
    try {
        const response = await axios.get(`http://localhost:8080/EcoIT/intern`,{
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách intern:', error);
        throw error;
    }
};

export const thanhSearch = async (keyword = '') => {
    try {
        const response = await axios.get(`http://localhost:8080/EcoIT/searchIntern`, {
            params: { keyword }
        });
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

export const deleteIntern = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:8080/EcoIT/intern-delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xoa intern:', error);
        throw error;
    }
};

export const updateIntern = async (id, internData) => {
    try {
        const response = await axios.put(`http://localhost:8080/EcoIT/intern-update/${id}`,internData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi update intern:', error);
        throw error;
    }
};


