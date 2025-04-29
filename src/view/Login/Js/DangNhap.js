import axios from "axios";

export const LoginIn = async (userName, password) => {
    try {
        console.log('Dữ liệu gửi đi:', { userName, password });
        const response = await axios.post(
            `http://localhost:8080/EcoIT/dang-nhap`,
            {
                userName,
                password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Phản hồi từ server:', response.data);
        const token = response.data.token || response.data.split("Token:")[1]?.trim();
        if (token) {
            localStorage.setItem("authToken", token);
            return { success: true, token };
        }
        throw new Error("Không nhận được token từ server");
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
};