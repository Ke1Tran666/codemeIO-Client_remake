import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../../components/Notification/NotificationContext';
import { Eye, EyeOff } from 'lucide-react'; // Import Lucide icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom

const API_URL = 'http://localhost:8080/api';

const ClientSignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate(); // Khai báo hook navigate

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}/login`, formData);
            showNotification('success', 'Đăng nhập thành công', 'Tài khoản của bạn đã được tạo.');
            console.log('Đăng nhập thành công', response.data);

            // Lưu thông tin người dùng vào localStorage hoặc context nếu cần
            localStorage.setItem('user', JSON.stringify(response.data)); // Giả sử response.data chứa thông tin người dùng

            // Chờ 3 giây trước khi chuyển hướng
            setTimeout(() => {
                navigate('/'); // Chuyển hướng đến trang chủ
                setIsSubmitting(false); // Đặt lại trạng thái isSubmitting sau khi chuyển hướng
            }, 3000); // Thời gian chờ 3000ms (3 giây)

        } catch (error) {
            showNotification('error', 'Đăng nhập thất bại', 'Đã có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Lỗi khi đăng nhập:', error);
            setIsSubmitting(false); // Đặt lại trạng thái isSubmitting nếu có lỗi
        }
    };

    return (
        <div className="max-w-xs mx-auto p-6 bg-gradient-to-t from-white to-[#f4f7fb] rounded-3xl border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] my-5">
            <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">Đăng nhập</h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                    <label htmlFor="username" className="sr-only">Tài khoản</label>
                    <input
                        placeholder="Tài khoản"
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-white border-none p-4 rounded-lg mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                        aria-required="true"
                    />
                </div>
                <div className="relative mt-4">
                    <label htmlFor="password" className="sr-only">Mật khẩu</label>
                    <input
                        placeholder="Mật khẩu"
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                        aria-required="true"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                <div className="flex justify-end">
                    <a href="#" className="text-xs text-[#0099ff] transition-all duration-200 hover:underline hover:underline-offset-4">
                        Quên mật khẩu?
                    </a>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                >
                    {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>

            <div className="text-center mt-4">
                <a href="/signup" className="text-xs text-[#0099ff] transition-all duration-200 hover:underline hover:underline-offset-4">
                    Không có tài khoản? Đăng ký ngay
                </a>
            </div>
        </div>
    );
};

export default ClientSignIn;