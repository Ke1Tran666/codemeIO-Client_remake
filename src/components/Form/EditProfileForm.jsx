import { useState, useEffect } from 'react';
import { User, X, Briefcase, Clock, ChevronDown, Eye, EyeOff, XIcon } from 'lucide-react';
import { BASE_URL, BASE_URL_API } from '../../api/config';
import axios from 'axios';
import PropTypes from 'prop-types';

// eslint-disable-next-line react/prop-types
const EditProfileForm = ({ user, onClose, onSave }) => {
    const [editedUser, setEditedUser] = useState(user);
    const [initialUser, setInitialUser] = useState(user);
    const [roleOptions, setRoleOptions] = useState([]);
    const [isRolesOpen, setIsRolesOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userRoles, setUserRoles] = useState([]); // Lưu vai trò của người dùng

    useEffect(() => {
        const fetchRoleOptions = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/roles`);
                setRoleOptions(response.data);
            } catch (error) {
                console.error('Error fetching role options:', error);
            }
        };

        const fetchUserRoles = async () => {
            if (user && user.userId) { // Kiểm tra user và userId
                try {
                    const response = await axios.get(`${BASE_URL_API}/userRoles/users/${user.userId}`);
                    setUserRoles(response.data.map(role => role.roleName));
                } catch (error) {
                    console.error('Error fetching user roles:', error);
                }
            }
        };

        // 'user.userId' is missing in props validation

        fetchRoleOptions();
        fetchUserRoles();
        setInitialUser(user);
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = {
            ...editedUser,
            roles: userRoles // Lưu ý rằng roles là một mảng
        };
        onSave(updatedUser); // Chỉ gọi với updatedUser
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleAddRole = (roleToAdd) => {
        if (roleToAdd && !userRoles.includes(roleToAdd)) {
            setUserRoles(prev => [...prev, roleToAdd]);
        }
        setIsRolesOpen(false);
    };

    const handleRemoveRole = (roleToRemove) => {
        setUserRoles(prev => prev.filter(role => role !== roleToRemove));
    };

    const getUnselectedRoles = () => {
        return roleOptions.filter(role => !userRoles.includes(role.roleName));
    };

    const isInstructor = userRoles.includes('Instructor');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-auto max-w-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close profile edit"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="col-span-full flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={`${BASE_URL}${editedUser.photo}`}
                                alt={`${editedUser.fullname}'s profile`}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md flex items-center gap-1.5">
                                <div className={`w-3 h-3 rounded-full ${editedUser.status === 'Active' ? 'bg-green-500' : editedUser.status === 'Inactive' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="text-sm text-gray-500">User ID: {editedUser.userId}</div>
                            <div className="text-sm text-gray-500">Account created on: {formatDate(editedUser.startDate)}</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full name</label>
                        <input
                            id="fullname"
                            name="fullname"
                            type="text"
                            value={editedUser.fullname}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

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
                                value={editedUser.username}
                                readOnly
                                className="flex-1 px-3 py-2 border rounded-r-lg bg-gray-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={editedUser.gender || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="space-y-2 col-span-full">
                        <label className="block text-sm font-medium text-gray-700">Quyền người dùng <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div
                                className="w-full min-h-[38px] px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer bg-white"
                                onClick={() => setIsRolesOpen(!isRolesOpen)}
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
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div className="py-1">
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

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Trạng thái người dùng <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <div
                                className="w-full min-h-[38px] px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer bg-white flex items-center justify-between"
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                            >
                                <span className={editedUser.status ? '' : 'text-gray-400'}>
                                    {editedUser.status === 'Active' ? 'Đã kích hoạt' :
                                        editedUser.status === 'Inactive' ? 'Chưa kích hoạt' : '--'}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                            {isStatusOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                                    <div className="py-1">
                                        <button
                                            key="active"
                                            type="button"
                                            onClick={() => {
                                                setEditedUser(prev => ({ ...prev, status: 'Active' }));
                                                setIsStatusOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Đã kích hoạt
                                        </button>
                                        <button
                                            key="inactive"
                                            type="button"
                                            onClick={() => {
                                                setEditedUser(prev => ({ ...prev, status: 'Inactive' }));
                                                setIsStatusOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        >
                                            Chưa kích hoạt
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <div className="relative">
                            <input
                                id="newPassword"
                                name="newPassword"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg pr-10"
                                placeholder="Nhập mật khẩu mới"
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

                    {isInstructor && (
                        <>
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
                                        value={editedUser.specialization || ''}
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
                                        value={editedUser.yearsOfExperience || ''}
                                        onChange={handleInputChange}
                                        className="flex-1 px-3 py-2 border rounded-r-lg"
                                    />
                                </div>
                            </div>
                        </>

                    )}
                </div>

                <div className="flex justify-end gap-3 p-4 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => {
                            setEditedUser(initialUser);
                            setNewPassword('');
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Default
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

// Thêm PropTypes cho component
EditProfileForm.propTypes = {
    user: PropTypes.shape({
        userId: PropTypes.number.isRequired, // Đảm bảo userId là một chuỗi và bắt buộc
        fullname: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        password: PropTypes.string,
        photo: PropTypes.string,
        specialization: PropTypes.string,
        yearsOfExperience: PropTypes.number,
        department: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default EditProfileForm;
