import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useNotification } from '../../../components/Notification/NotificationContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api';

const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const DEFAULT_FORM_DATA = {
    username: '',
    password: '',
    fullname: '',
    email: '',
    phone: '',
    gender: '',
    status: 'Active',
    userType: 'student',
    startDate: getCurrentDate()
};

const ClientSignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form
        setIsSubmitting(true); // Đặt trạng thái đang gửi lên true

        // Kiểm tra xem fullname có hợp lệ không
        if (!formData.fullname) {
            showNotification('error', 'Đăng ký thất bại', 'Họ và tên không được để trống.');
            setIsSubmitting(false); // Đặt lại trạng thái nếu có lỗi
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/register`, formData);
            showNotification('success', 'Đăng ký thành công', 'Tài khoản của bạn đã được tạo.');
            console.log('Đăng ký thành công', response.data);

            // Reset form sau khi đăng ký thành công
            setFormData(DEFAULT_FORM_DATA);

            // Chờ 3 giây trước khi chuyển hướng
            setTimeout(() => {
                navigate('/'); // Chuyển hướng đến trang chủ
                setIsSubmitting(false); // Đặt lại trạng thái isSubmitting sau khi chuyển hướng
            }, 3000);
        } catch (error) {
            if (error.response && error.response.data) {
                showNotification('error', 'Đăng ký thất bại', error.response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!');
            } else {
                showNotification('error', 'Đăng ký thất bại', 'Đã có lỗi xảy ra. Vui lòng thử lại!');
            }
            console.error('Lỗi khi đăng ký:', error);
            setIsSubmitting(false); // Đặt lại trạng thái nếu có lỗi
        }
    };

    return (
        <div className="max-w-[500px] w-full mx-auto p-6 bg-gradient-to-t from-white to-[#f4f7fb] rounded-3xl border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] my-5">
            <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">Đăng ký</h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Tên tài khoản */}
                <div>
                    <label htmlFor="username" className="block mb-1">Tên tài khoản</label>
                    <input
                        placeholder="Tên tài khoản"
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                    />
                </div>

                {/* Mật khẩu */}
                <div className="mt-4">
                    <label htmlFor="password" className="block mb-1">Mật khẩu</label>
                    <div className='relative'>
                        <input
                            placeholder="Mật khẩu"
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Họ và tên */}
                <div>
                    <label htmlFor="fullname" className="block mb-1">Họ và tên</label>
                    <input
                        placeholder="Họ và tên"
                        id="fullname"
                        name="fullname"
                        type="text"
                        value={formData.fullname}
                        onChange={handleChange}
                        className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        placeholder="Email"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                    />
                </div>

                {/* Số điện thoại */}
                <div>
                    <label htmlFor="phone" className="block mb-1">Số điện thoại</label>
                    <input
                        placeholder="Số điện thoại"
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                    />
                </div>

                {/* Giới tính */}
                <div className="mt-4">
                    <label htmlFor="gender" className="block mb-1">Giới tính:</label>
                    <select
                        id="gender"
                        name="gender"
                        className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                    </select>
                </div>

                {/* Nút đăng ký */}
                <button
                    type="submit"
                    className={`w-full py-3 rounded-lg mt-6 ${isSubmitting ? 'bg-gray-400' : 'bg-[#1089d3] text-white'}`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
            </form>
        </div>
    );
};

export default ClientSignUp;