import axios from "axios";


export const Register = async (userName, password, email, phoneNumber) => {
    if (!userName || !password || !email) {
        throw new Error("Tên người dùng, mật khẩu và email là bắt buộc");
    }

    try {
        const response = await axios.post(
            "http://localhost:8080/EcoIT/dang-ky",
            { userName, password, email, phoneNumber },
            { headers: { "Content-Type": "application/json" } }
        );

        if (!response.data) {
            throw new Error("Không nhận được dữ liệu từ server");
        }

        return { success: true, user: response.data, message: "Đăng ký thành công" };
    } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || "Đã xảy ra lỗi khi đăng ký";
        throw new Error(errorMessage);
    }
};