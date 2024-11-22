import { useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../../components/Notification/NotificationContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8081/api';

const ClientResetPassword = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (newPassword !== confirmPassword) {
            showNotification('error', 'Mật khẩu không khớp', 'Vui lòng nhập lại mật khẩu.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
            showNotification('success', 'Thành công', 'Mật khẩu đã được cập nhật.');
            console.log('Đặt lại mật khẩu thành công:', response.data);
            navigate('/signin'); // Chuyển hướng đến trang đăng nhập
        } catch (error) {
            const errorMessage = error.response?.data || 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            showNotification('error', 'Lỗi', errorMessage);
            console.error('Lỗi khi đặt lại mật khẩu:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xs mx-auto p-6 bg-gradient-to-t from-white to-[#f4f7fb] rounded-3xl border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] my-5">
            <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">Đặt Lại Mật Khẩu</h2>
            <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
                <div>
                    <label htmlFor="token" className="sr-only">Token</label>
                    <input
                        placeholder="Nhập token"
                        id="token"
                        type="text"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full bg-white border-none p-4 rounded-lg mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="sr-only">Mật khẩu mới</label>
                    <input
                        placeholder="Mật khẩu mới"
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white border-none p-4 rounded-lg mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="sr-only">Xác nhận mật khẩu</label>
                    <input
                        placeholder="Xác nhận mật khẩu"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white border-none p-4 rounded-lg mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                >
                    {isSubmitting ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                </button>
            </form>
        </div>
    );
};

export default ClientResetPassword;