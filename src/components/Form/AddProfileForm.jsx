import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, X, Briefcase, Clock, ChevronDown, Eye, EyeOff, Upload, XIcon } from 'lucide-react';
import { BASE_URL_API } from '../../api/config';
import PropTypes from 'prop-types';
import { useNotification } from '../../components/Notification/NotificationContext';

const AddProfileForm = ({ onClose, onSave }) => {
    const [newUser, setNewUser] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        gender: '',
        phone: '',
        specialization: '',
        yearsOfExperience: '',
        status: 'Active',
        photo: null
    });
    const [roleOptions, setRoleOptions] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [previewImage,] = useState(null);
    const [rolesDropdownPosition, setRolesDropdownPosition] = useState({ top: 0, left: 0 });
    const [isGenderOpen, setIsGenderOpen] = useState(false); // Added state for gender dropdown
    const { showNotification } = useNotification();

    // Lấy danh sách vai trò từ API
    useEffect(() => {
        const fetchRoleOptions = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/roles`);
                setRoleOptions(response.data);
            } catch (error) {
                console.error('Error fetching role options:', error);
            }
        };
        fetchRoleOptions();
    }, []);

    // Hàm xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    // Hàm xử lý thay đổi file
    const handleFileChange = (e) => {
        setNewUser(prev => ({ ...prev, photo: e.target.files[0] }));
    };

    // Hàm xử lý gửi dữ liệu
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, email, fullname, gender, phone } = newUser;

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password || !email || !fullname || !gender || !phone || userRoles.length === 0) {
            showNotification('error', 'Vui lòng điền đầy đủ thông tin cần thiết và chọn vai trò', '');
            return;
        }

        // Tạo đối tượng dữ liệu người dùng
        const userData = {
            username,
            password,
            email,
            fullname,
            gender,
            phone,
            specialization: newUser.specialization || '',
            yearsOfExperience: newUser.yearsOfExperience || '',
            status: newUser.status,
            roles: userRoles,
            photo: newUser.photo, // Đính kèm hình ảnh nếu có
        };
        // Gọi hàm onSave từ component cha
        onSave(userData);
    };

    // Hàm thêm vai trò
    const handleAddRole = (roleToAdd) => {
        if (roleToAdd && !userRoles.includes(roleToAdd)) {
            setUserRoles(prev => [...prev, roleToAdd]);
        }
    };

    // Hàm xóa vai trò
    const handleRemoveRole = (roleToRemove) => {
        setUserRoles(prev => prev.filter(role => role !== roleToRemove));
    };

    const getUnselectedRoles = () => {
        return roleOptions.filter(role => !userRoles.includes(role.roleName));
    };

    const isInstructor = userRoles.includes('Instructor');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Thêm Người Dùng Mới</h2>
                    <button
                        onClick={onClose}
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close add user form"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Row 1: Image, Username, Password */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3 flex justify-center">
                            <div className="relative">
                                <img
                                    src={previewImage || '/placeholder.svg?height=100&width=100'}
                                    alt="User profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <label htmlFor="imageUpload" className="absolute bottom-4 right-3 bg-white p-2 rounded-full shadow-md cursor-pointer">
                                    <Upload className="h-5 w-5 text-gray-600" />
                                    <input
                                        id="imageUpload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="md:w-2/3 space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <div className="flex items-center">
                                    <span className="bg-gray-100 px-3 py-2 border rounded-l-lg border-r-0 text-gray-500">
                                        <User className="w-6 h-6" />
                                    </span>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={newUser.username}
                                        onChange={handleInputChange}
                                        className="flex-1 px-3 py-2 border rounded-r-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={newUser.password}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-lg pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Full name, Email address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full name</label>
                            <input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={newUser.fullname}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={newUser.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3: Gender and Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <div
                                    className="w-full min-h-[38px] px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer bg-white flex items-center justify-between"
                                    onClick={() => setIsGenderOpen(!isGenderOpen)}
                                >
                                    <span className={newUser.gender ? "text-gray-900" : "text-gray-400"}>
                                        {newUser.gender || "Select gender"}
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                                {isGenderOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                        <div className="py-1">
                                            {["Male", "Female", "Other"].map((gender) => (
                                                <button
                                                    key={gender}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewUser(prev => ({ ...prev, gender }));
                                                        setIsGenderOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                >
                                                    {gender}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={newUser.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Row 4: User Roles */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">User Roles <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div
                                className="w-full min-h-[38px] px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer bg-white"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setRolesDropdownPosition({
                                        top: rect.bottom + window.scrollY,
                                        left: rect.left + window.scrollX,
                                    });
                                    setIsRolesOpen(!isRolesOpen);
                                }}
                            >
                                {userRoles.length === 0 && <span className="text-gray-400">--</span>}
                                <div className="flex flex-wrap gap-1">
                                    {userRoles.map(role => (
                                        <div key={role} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                            {role}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveRole(role);
                                                }}
                                                className="hover:text-gray-700"
                                            >
                                                <XIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            {isRolesOpen && (
                                <div
                                    className="fixed z-50 w-full max-w-[calc(100%-3rem)] md:max-w-[300px] bg-white border rounded-lg shadow-lg"
                                    style={{
                                        top: `${rolesDropdownPosition.top}px`,
                                        left: `${rolesDropdownPosition.left}px`,
                                    }}
                                >
                                    <div className="py-1 max-h-60 overflow-y-auto">
                                        {getUnselectedRoles().map(role => (
                                            <button
                                                key={role.roleId}
                                                type="button"
                                                onClick={() => handleAddRole(role.roleName)}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                {role.roleName}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 5: Specialization, Years of Experience (conditional) */}
                    {isInstructor && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                                <div className="flex items-center">
                                    <span className="bg-gray-50 px-3 py-2 border rounded-l-lg border-r-0 text-gray-500">
                                        <Briefcase className="w-6 h-6" />
                                    </span>
                                    <input
                                        id="specialization"
                                        name="specialization"
                                        type="text"
                                        value={newUser.specialization}
                                        onChange={handleInputChange}
                                        className="flex-1 px-3 py-2 border rounded-r-lg"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                                <div className="flex items-center">
                                    <span className="bg-gray-50 px-3 py-2 border rounded-l-lg border-r-0 text-gray-500">
                                        <Clock className="w-6 h-6" />
                                    </span>
                                    <input
                                        id="yearsOfExperience"
                                        name="yearsOfExperience"
                                        type="number"
                                        value={newUser.yearsOfExperience}
                                        onChange={handleInputChange}
                                        className="flex-1 px-3 py-2 border rounded-r-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-4 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Thêm Người Dùng
                    </button>
                </div>
            </form>
        </div>
    );
};

AddProfileForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default AddProfileForm;