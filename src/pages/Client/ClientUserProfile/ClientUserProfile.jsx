import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useNotification } from '../../../components/Notification/NotificationContext';

const API_URL = 'http://localhost:8081';
const API_URL_USER = `${API_URL}/api/user`;

const ClientUserProfile = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState({
        fullname: false,
        email: false,
        phone: false,
        password: false
    });
    const [userData, setUserData] = useState({
        userId: null,
        fullname: '',
        email: '',
        phone: '',
        password: '********',
        photo: 'https://via.placeholder.com/150'
    });
    const { showNotification } = useNotification();
    const editRef = useRef(); // Tạo ref cho phần chỉnh sửa

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        } else {
            showNotification('error', 'Lỗi tải dữ liệu', 'Không tìm thấy thông tin người dùng.');
        }
    }, [showNotification]);

    // Sự kiện click bên ngoài để đóng chỉnh sửa
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (editRef.current && !editRef.current.contains(event.target)) {
                setIsEditing({
                    fullname: false,
                    email: false,
                    phone: false,
                    password: false
                });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleEdit = (field) => {
        setIsEditing(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (field) => {
        if (!userData.userId) {
            showNotification('error', 'Lỗi', 'ID người dùng không xác định.');
            return;
        }

        try {
            const updatedUser = { ...userData, [field]: userData[field] };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            const response = await axios.put(`${API_URL_USER}/${userData.userId}`, { [field]: userData[field] });

            if (response.status === 200) {
                setIsEditing(prev => ({ ...prev, [field]: false }));
                showNotification('success', 'Cập nhật thành công', `${field} đã được cập nhật.`);
            }
        } catch (error) {
            showNotification('error', 'Cập nhật thất bại', 'Đã có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Lỗi khi cập nhật:', error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.put(`${API_URL_USER}/${userData.userId}/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (response.status === 200) {
                    const newImageUrl = response.data.imageUrl;
                    if (newImageUrl) {
                        setUserData(prev => {
                            const updatedUser = { ...prev, photo: newImageUrl };
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                            return updatedUser;
                        });

                        showNotification('success', 'Cập nhật hình ảnh thành công', '');
                    } else {
                        showNotification('error', 'Lỗi', 'URL hình ảnh không có sẵn.');
                    }
                }
            } catch (error) {
                showNotification('error', 'Cập nhật hình ảnh thất bại', 'Vui lòng thử lại!');
                console.error('Lỗi khi cập nhật hình ảnh:', error);
            }
        }
    };

    const renderField = (field, label, type = 'text') => (
        <div className="mt-4">
            <label htmlFor={field} className="block mb-1">{label}</label>
            {isEditing[field] ? (
                <div className="flex">
                    <input
                        id={field}
                        name={field}
                        type={field === 'password' ? (showPassword ? 'text' : 'password') : type}
                        value={userData[field]}
                        onChange={handleChange}
                        className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                    />
                    {field === 'password' && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="ml-2 p-2 bg-gray-200 rounded-lg"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    )}
                    <button
                        onClick={() => handleSave(field)}
                        className="ml-2 px-4 py-2 bg-[#1089d3] text-white rounded-lg"
                    >
                        Lưu
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <span className="text-gray-700">{field === 'password' ? '********' : userData[field]}</span>
                    <button
                        onClick={() => handleEdit(field)}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        Sửa
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div ref={editRef} className="max-w-[500px] w-full mx-auto p-6 bg-gradient-to-t from-white to-[#f4f7fb] rounded-3xl border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] my-5">
            <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">Hồ sơ người dùng</h2>

            <div className="mt-5 space-y-4">
                <div className="flex flex-col items-center">
                    <img src={`${API_URL}${userData.photo}`} alt="Profile" className="w-32 h-32 rounded-full mb-2" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 px-4 py-2 rounded-lg">
                        Thay đổi ảnh
                    </label>
                </div>

                {renderField('fullname', 'Họ và tên')}
                {renderField('email', 'Email', 'email')}
                {renderField('phone', 'Số điện thoại', 'tel')}
                {renderField('password', 'Mật khẩu', 'password')}
            </div>
        </div>
    );
};

export default ClientUserProfile;