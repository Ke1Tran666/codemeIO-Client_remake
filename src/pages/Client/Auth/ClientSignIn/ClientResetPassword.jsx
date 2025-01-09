import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL_API } from '../../../../api/config';
import StepIndicator from '../../../../components/StepIndicator/StepIndicator';
import { Eye, EyeOff } from 'lucide-react';

const ClientResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState('email'); // 'email', 'otp', or 'password'
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post(`${BASE_URL_API}/forgot-password`, { email });
            showNotification('success', 'Thành công', 'Mã OTP đã được gửi đến email của bạn.');
            setStep('otp');
        } catch (error) {
            const errorMessage = error.response?.data || 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            showNotification('error', 'Lỗi', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post(`${BASE_URL_API}/verify-otp`, { otp });
            showNotification('success', 'Thành công', 'Mã OTP đã được xác thực.');
            setStep('password');
        } catch (error) {
            const errorMessage = error.response?.data || 'Mã OTP không hợp lệ. Vui lòng thử lại!';
            showNotification('error', 'Lỗi', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (newPassword !== confirmPassword) {
            showNotification('error', 'Mật khẩu không khớp', 'Vui lòng nhập lại mật khẩu.');
            setIsSubmitting(false);
            return;
        }

        try {
            await axios.post(`${BASE_URL_API}/reset-password`, { email, newPassword });
            showNotification('success', 'Thành công', 'Mật khẩu đã được cập nhật.');
            navigate('/signin');
        } catch (error) {
            const errorMessage = error.response?.data || 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            showNotification('error', 'Lỗi', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = () => {
        navigate('/signin');
    };

    const renderForm = () => {
        switch (step) {
            case 'email':
                return (
                    <form onSubmit={handleSendOTP} className="mt-5 space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                placeholder="Nhập email của bạn"
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border-none p-4 rounded-lg mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi mã OTP'}
                        </button>
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs text-[#0099ff] transition-all duration-200 hover:underline"
                            >
                                Quay lại đăng nhập
                            </button>
                        </div>
                    </form>
                );
            case 'otp':
                return (
                    <form onSubmit={handleVerifyOTP} className="mt-5 space-y-4">
                        <div>
                            <label htmlFor="otp" className="sr-only">Mã OTP</label>
                            <input
                                placeholder="Nhập mã OTP"
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-white border-none p-4 rounded-lg mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                        >
                            {isSubmitting ? 'Đang xác thực...' : 'Xác thực OTP'}
                        </button>
                    </form>
                );
            case 'password':
                return (
                    <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
                        <div className="relative">
                            <label htmlFor="newPassword" className="sr-only">Mật khẩu mới</label>
                            <input
                                placeholder="Mật khẩu mới"
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="relative">
                            <label htmlFor="confirmPassword" className="sr-only">Xác nhận mật khẩu</label>
                            <input
                                placeholder="Xác nhận mật khẩu"
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                        >
                            {isSubmitting ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="max-w-md mx-auto my-5">
            <StepIndicator currentStep={step} />
            <div className="mt-6 max-w-xs mx-auto p-6 bg-gradient-to-t from-white to-[#f4f7fb] rounded-3xl border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)]">
                <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">Đặt Lại Mật Khẩu</h2>
                {renderForm()}
            </div>
        </div>
    );
};

export default ClientResetPassword;