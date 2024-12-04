import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';

const ClientRoles = () => {
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentRole, setCurrentRole] = useState({ roleName: '', roleId: '' });
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add'); // 'add' hoặc 'edit'
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/roles`);
                setRoles(response.data);
                setFilteredRoles(response.data); // Cập nhật danh sách vai trò ban đầu
            } catch (error) {
                console.error('Error fetching roles:', error);
                showNotification('error', 'Lỗi tải dữ liệu', 'Không tìm thấy thông tin vai trò.');
            }
        };

        fetchRoles();
    }, [showNotification]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term) {
            // Nếu không có từ khóa tìm kiếm, hiển thị tất cả vai trò
            setFilteredRoles(roles);
            return;
        }

        // Lọc vai trò theo tên vai trò
        const filtered = roles.filter(role =>
            role.roleName.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredRoles(filtered);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (formAction === 'add') {
                response = await axios.post(`${BASE_URL_API}/roles`, currentRole);
                setRoles([...roles, response.data]);
                setFilteredRoles([...filteredRoles, response.data]); // Cập nhật cả danh sách đã lọc
                showNotification('success', 'Thành công', 'Vai trò đã được thêm.');
            } else if (formAction === 'edit') {
                response = await axios.put(`${BASE_URL_API}/roles/${currentRole.roleId}`, currentRole);
                setRoles(roles.map(role => role.roleId === currentRole.roleId ? response.data : role));
                setFilteredRoles(filteredRoles.map(role => role.roleId === currentRole.roleId ? response.data : role)); // Cập nhật danh sách đã lọc
                showNotification('success', 'Thành công', 'Vai trò đã được cập nhật.');
            }
            setCurrentRole({ roleName: '', roleId: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Lỗi', 'Không thể thực hiện thao tác.');
        }
    };

    const handleEditRole = (role) => {
        setCurrentRole({ roleName: role.roleName, roleId: role.roleId });
        setFormAction('edit');
        setShowForm(true);
    };

    const handleDeleteRole = async (roleId) => {
        try {
            await axios.delete(`${BASE_URL_API}/roles/${roleId}`);
            setRoles(roles.filter(role => role.roleId !== roleId));
            setFilteredRoles(filteredRoles.filter(role => role.roleId !== roleId)); // Cập nhật danh sách đã lọc
            showNotification('success', 'Thành công', 'Vai trò đã được xóa.');
        } catch (error) {
            console.error('Error deleting role:', error);
            showNotification('error', 'Lỗi xóa vai trò', 'Không thể xóa vai trò.');
        }
    };

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Roles</h2>

            <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search roles..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)} // Gọi hàm tìm kiếm khi có thay đổi
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setFormAction('add');
                        setCurrentRole({ roleName: '', roleId: '' });
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Role
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{formAction === 'add' ? 'Add New Role' : 'Edit Role'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Role Name"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={currentRole.roleName}
                                onChange={(e) => setCurrentRole({ ...currentRole, roleName: e.target.value })}
                                required
                            />
                            <div className="flex justify-end space-x-2">
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    {formAction === 'add' ? 'Add' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {filteredRoles.map(role => (
                    <div key={role.roleId} className="border p-4 rounded-lg hover:shadow-custom-1">
                        <h3 className="text-lg font-semibold">{role.roleName}</h3>
                        <div className="flex justify-end space-x-2 mt-2">
                            <button onClick={() => handleEditRole(role)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteRole(role.roleId)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClientRoles;