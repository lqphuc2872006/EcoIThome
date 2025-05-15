import axios from "axios";

export const getAllHopIntern = async  () => {
    try {
        const response = await axios.get('http://localhost:8080/EcoIT/hop-intern');
        return response.data
    } catch (error) {
        console.error("loi k lay dc danh sach hop intern",error);
        throw error;
    }
};

export const getSearch = async  (keyword = '') => {
    try {
        const response = await axios.get('http://localhost:8080/EcoIT/searchHopIntern', {
            params: {keyword}
        });
        return response.data;
    } catch (error) {
        console.error("loi k search intern",error);
        throw error;
    }
};

export const getAllMentor = async  () => {
    try {
        const response = await axios.get('http://localhost:8080/EcoIT/mentor');
        return response.data
    } catch (error) {
        console.error("loi k lay dc danh sach hop mentor",error);
        throw error;
    }
};

export const addIntern = async (internData) => {
    try {
        const response = await axios.post('http://localhost:8080/EcoIT/intern-hop-add', internData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm intern:", error);
        throw error;
    }
};
export const detailIntern = async  (id) => {
    try {
        const response = await axios.get(`http://localhost:8080/EcoIT/hopintern-detail/${id}`);
        return response.data
    } catch (error) {
        console.error("loi k lay dc danh sach hop intern",error);
        throw error;
    }
};

export const deletedIntern = async  (id) => {
    try {
        const response = await axios.delete(`http://localhost:8080/EcoIT/internHop-delete/${id}`);
        return response.data
    } catch (error) {
        console.error("loi k lay dc danh sach hop intern",error);
        throw error;
    }
};

export const updateIntern = async  (id,internData) => {
    try {
        const response = await axios.put(`http://localhost:8080/EcoIT/intern-hop-update/${id}`,internData);
        return response.data
    } catch (error) {
        console.error("loi k lay dc danh sach hop intern",error);
        throw error;
    }
};