import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../../components/Notification/NotificationContext';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8081/api';

const ClientSignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const { showNotification } = useNotification();
    const navigate = useNavigate();

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

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}/login`, formData);
            showNotification('success', 'Đăng nhập thành công', 'Tài khoản của bạn đã được đăng nhập.');
            console.log('Đăng nhập thành công', response.data);
            localStorage.setItem('user', JSON.stringify(response.data));

            setTimeout(() => {
                navigate('/');
                setIsSubmitting(false);
            }, 3000);

        } catch (error) {
            showNotification('error', 'Đăng nhập thất bại', 'Tên người dùng hoặc mật khẩu không chính xác.');
            console.error('Lỗi khi đăng nhập:', error);
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!email) {
            showNotification('error', 'Email không hợp lệ', 'Vui lòng nhập email.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            showNotification('success', 'Email đã được gửi', 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
            console.log('Yêu cầu quên mật khẩu thành công:', response.data);
            setIsForgotPassword(false); // Quay lại đăng nhập sau khi gửi email
        } catch (error) {
            if (error.response && error.response.status === 404) {
                showNotification('error', 'Email không tồn tại', 'Vui lòng nhập email đúng.');
            } else {
                showNotification('error', 'Lỗi', 'Đã có lỗi xảy ra. Vui lòng thử lại!');
            }
            console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xs mx-auto p-6 bg-gradient-to-t from-white to-[#f4f7fb] rounded-3xl border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] my-5">
            <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">{isForgotPassword ? 'Quên Mật Khẩu' : 'Đăng Nhập'}</h2>

            <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="mt-5 space-y-4">
                {isForgotPassword ? (
                    <>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                placeholder="Nhập email của bạn"
                                id="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full bg-white border-none p-4 rounded-lg mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                                required
                                aria-required="true"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                        <div className="text-center mt-4">
                            <button onClick={() => setIsForgotPassword(false)} className="text-xs text-[#0099ff] transition-all duration-200 hover:underline hover:underline-offset-4">
                                Quay lại đăng nhập
                            </button>
                        </div>
                    </>
                ) : (
                    <>
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
                            <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-[#0099ff] transition-all duration-200 hover:underline hover:underline-offset-4">
                                Quên mật khẩu?
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                        >
                            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </>
                )}
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