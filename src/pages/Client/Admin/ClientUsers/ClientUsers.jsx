import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';

const ClientUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState({ userId: '', fullname: '', email: '', phone: '', password: '', photo: '' });
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add');
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/users/`);
                setUsers(response.data);
                setFilteredUsers(response.data); // Cập nhật danh sách người dùng ban đầu
            } catch (error) {
                console.error('Error fetching users:', error);
                showNotification('error', 'Error loading data', 'Unable to fetch user information.');
            }
        };

        fetchUsers();
    }, [showNotification]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term) {
            // Nếu không có từ khóa tìm kiếm, hiển thị tất cả người dùng
            setFilteredUsers(users);
            return;
        }

        // Lọc người dùng theo tên đầy đủ
        const filtered = users.filter(user =>
            user.fullname.toLowerCase().includes(term.toLowerCase()) ||
            user.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (formAction === 'add') {
                response = await axios.post(`${BASE_URL_API}/users/`, currentUser);
                setUsers([...users, { ...currentUser, userId: response.data.userId }]);
                setFilteredUsers([...filteredUsers, { ...currentUser, userId: response.data.userId }]);
                showNotification('success', 'Success', 'User has been added.');
            } else if (formAction === 'edit') {
                response = await axios.put(`${BASE_URL_API}/users/${currentUser.userId}`, currentUser);
                setUsers(users.map(user => (user.userId === currentUser.userId ? response.data : user)));
                setFilteredUsers(filteredUsers.map(user => (user.userId === currentUser.userId ? response.data : user)));
                showNotification('success', 'Success', 'User has been updated.');
            }
            setCurrentUser({ userId: '', fullname: '', email: '', phone: '', password: '', photo: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Error', 'Unable to perform the operation.');
        }
    };

    const handleEditUser = (user) => {
        setCurrentUser({ ...user });
        setFormAction('edit');
        setShowForm(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${BASE_URL_API}/users/${userId}`);
            setUsers(users.filter(user => user.userId !== userId));
            setFilteredUsers(filteredUsers.filter(user => user.userId !== userId));
            showNotification('success', 'Success', 'User has been deleted.');
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification('error', 'Error deleting user', 'Unable to delete the user.');
        }
    };

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Users</h2>

            <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search users..."
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
                        setCurrentUser({ userId: '', fullname: '', email: '', phone: '', password: '', photo: '' });
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add User
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{formAction === 'add' ? 'Add New User' : 'Edit User'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={currentUser.fullname}
                                onChange={(e) => setCurrentUser({ ...currentUser, fullname: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={currentUser.email}
                                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={currentUser.phone}
                                onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={currentUser.password}
                                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
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
                {filteredUsers.map(user => (
                    <div key={user.userId} className="border p-4 rounded-lg hover:shadow-custom-1">
                        <h3 className="text-lg font-semibold">{user.fullname}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">{user.phone}</p>
                        <div className="flex justify-end space-x-2 mt-2">
                            <button onClick={() => handleEditUser(user)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteUser(user.userId)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClientUsers;