import { useEffect, useState } from 'react';
import { Search, Plus, ChevronRight, ChevronLeft, MoreVertical } from 'lucide-react'; // Giữ nguyên các import khác
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

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/users/`);
                setUsers(response.data);
                setFilteredUsers(response.data);
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
            setFilteredUsers(users);
            setCurrentPage(1);
            return;
        }

        const filtered = users.filter(user =>
            user.fullname.toLowerCase().includes(term.toLowerCase()) ||
            user.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
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

    const handleMoreOptions = (user) => {
        // Hiện menu tùy chọn cho người dùng
        const options = [
            { label: 'View profile', action: () => console.log('View profile:', user) },
            { label: 'Edit details', action: () => { setCurrentUser(user); setFormAction('edit'); setShowForm(true); } },
            { label: 'Change permission', action: () => console.log('Change permission:', user) },
            { label: 'Export details', action: () => console.log('Export details:', user) },
            { label: 'Delete user', action: () => handleDeleteUser(user.userId) },
        ];
        return options;
    };

    // Tính toán người dùng hiển thị trên trang hiện tại
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Users</h2>

            <div className="flex justify-between items-center mb-4">
                <div className="text-lg">
                    Tổng số người dùng: {filteredUsers.length}
                </div>
                <div className="flex items-center">
                    <div className="relative w-64 mr-4">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
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

            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">User</th>
                        <th className="py-2 px-4 border-b">Access</th>
                        <th className="py-2 px-4 border-b">Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.userId} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{user.fullname}</td>
                            <td className="py-2 px-4 border-b">{user.access}</td>
                            <td className="py-2 px-4 border-b">{new Date(user.dateAdded).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b text-right">
                                <button
                                    onClick={() => {
                                        const options = handleMoreOptions(user);
                                        // Hiện menu tùy chọn (có thể dùng thư viện để tạo menu)
                                        console.log(options);
                                    }}
                                    className="p-2 rounded-lg hover:bg-gray-300"
                                >
                                    {/* Sử dụng biểu tượng ba chấm dọc */}
                                    <MoreVertical className='text-gray-500' />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChevronLeft />
                </button>

                {totalPages > 6 ? (
                    <>
                        {currentPage > 3 && (
                            <>
                                <button onClick={() => setCurrentPage(1)} className="px-4 py-2 border rounded-lg bg-white text-blue-500 hover:bg-blue-100">1</button>
                                {currentPage > 4 && <span className="px-2">...</span>}
                            </>
                        )}
                        {currentPage - 1 > 0 && (
                            <button onClick={() => setCurrentPage(currentPage - 1)} className="px-4 py-2 border rounded-lg bg-white text-blue-500 hover:bg-blue-100">{currentPage - 1}</button>
                        )}
                        <button className="px-4 py-2 border rounded-lg bg-blue-500 text-white">{currentPage}</button>
                        {currentPage + 1 <= totalPages && (
                            <button onClick={() => setCurrentPage(currentPage + 1)} className="px-4 py-2 border rounded-lg bg-white text-blue-500 hover:bg-blue-100">{currentPage + 1}</button>
                        )}
                        {currentPage < totalPages - 2 && (
                            <>
                                {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                                <button onClick={() => setCurrentPage(totalPages)} className="px-4 py-2 border rounded-lg bg-white text-blue-500 hover:bg-blue-100">{totalPages}</button>
                            </>
                        )}
                    </>
                ) : (
                    Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 border rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                        >
                            {index + 1}
                        </button>
                    ))
                )}

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
}

export default ClientUsers;