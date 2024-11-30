import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../../components/Notification/NotificationContext';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL_API } from '../../../api/config';

const ClientSignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${BASE_URL_API}/login`, formData);
            showNotification('success', 'Đăng nhập thành công', 'Tài khoản của bạn đã được đăng nhập.');
            localStorage.setItem('user', JSON.stringify(response.data));
            const coursesResponse = await axios.get(`${BASE_URL_API}/enrollments/student/${response.data.userId}/courses`);
            localStorage.setItem('courses', JSON.stringify(coursesResponse.data));

            setTimeout(() => {
                navigate('/');
                window.location.reload();
                setIsSubmitting(false);
            }, 3000);
        } catch (error) {
            showNotification('error', 'Đăng nhập thất bại', 'Tên người dùng hoặc mật khẩu không chính xác.');
            console.error('Lỗi khi đăng nhập:', error);
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
            await axios.post(`${BASE_URL_API}/forgot-password`, { email });
            showNotification('success', 'Email đã được gửi', 'Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.');
            setIsForgotPassword(false);
        } catch (error) {
            const message = error.response && error.response.status === 404
                ? 'Email không tồn tại'
                : 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            showNotification('error', message, 'Vui lòng nhập email đúng.');
            console.error('Lỗi khi gửi yêu cầu quên mật khẩu:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderInput = (id, name, type, placeholder, value, onChange) => (
        <div className="mt-4">
            <label htmlFor={id} className="sr-only">{placeholder}</label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                required
                aria-required="true"
            />
        </div>
    );

    return (
        <div className="max-w-xs mx-auto p-6 bg-gradient-to-t from-white to-[#f4f7fb] rounded-3xl border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] my-5">
            <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">{isForgotPassword ? 'Quên Mật Khẩu' : 'Đăng Nhập'}</h2>

            <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="mt-5 space-y-4">
                {isForgotPassword ? (
                    <>
                        {renderInput("email", "email", "email", "Nhập email của bạn", email, handleEmailChange)}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)]"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                        <div className="text-center mt-4">
                            <button onClick={() => setIsForgotPassword(false)} className="text-xs text-[#0099ff] transition-all duration-200 hover:underline">Quay lại đăng nhập</button>
                        </div>
                    </>
                ) : (
                    <>
                        {renderInput("username", "username", "text", "Tài khoản", formData.username, handleChange)}
                        <div className="relative">
                            {renderInput("password", "password", showPassword ? "text" : "password", "Mật khẩu", formData.password, handleChange)}
                            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-[#0099ff] transition-all duration-200 hover:underline">Quên mật khẩu?</button>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)]"
                        >
                            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </>
                )}
            </form>

            <div className="text-center mt-4">
                <a href="/signup" className="text-xs text-[#0099ff] transition-all duration-200 hover:underline">Không có tài khoản? Đăng ký ngay</a>
            </div>
        </div>
    );
};

export default ClientSignIn;