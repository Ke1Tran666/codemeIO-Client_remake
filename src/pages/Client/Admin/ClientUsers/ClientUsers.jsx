import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, MoreVertical, Eye, Edit, Lock, Download, Trash } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API, BASE_URL } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import Pagination from '../../../../components/Pagination/Pagination';
import Count from '../../../../components/Count/Count';
import InputSearch from '../../../../components/Search/Search';
import TableHeader from '../../../../components/Table/TableHeader';
import ProfileView from '../../../../components/Form/ViewProfileForm';

const ClientUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState({ userId: '', fullname: '', email: '', phone: '', password: '', photo: '' });
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add');
    const { showNotification } = useNotification();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [showProfile, setShowProfile] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;
    const headers = ['User', 'Access', 'Status', 'Date Added'];

    const dropdownRef = useRef(null);

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
        const options = [
            {
                label: 'View profile',
                action: () => {
                    setSelectedUser(user);
                    setShowProfile(true);
                },
                icon: <Eye className="h-4 w-4 mr-2" />
            },
            { label: 'Edit details', action: () => { setCurrentUser(user); setFormAction('edit'); setShowForm(true); }, icon: <Edit className="h-4 w-4 mr-2" /> },
            { label: 'Change permission', action: () => console.log('Change permission:', user), icon: <Lock className="h-4 w-4 mr-2" /> },
            { label: 'Export details', action: () => console.log('Export details:', user), icon: <Download className="h-4 w-4 mr-2" /> },
            { label: 'Delete user', action: () => handleDeleteUser(user.userId), icon: <Trash className="h-4 w-4 mr-2" /> },
        ];
        return options;
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActiveDropdown(null);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        const handleScroll = () => {
            setActiveDropdown(null);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleMoreVerticalClick = (event, userId) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 200;

        setDropdownPosition({
            top: spaceBelow > dropdownHeight || spaceBelow > spaceAbove
                ? rect.bottom + window.scrollY
                : rect.top - dropdownHeight + window.scrollY,
            left: rect.right - 192 + window.scrollX
        });
        setActiveDropdown(activeDropdown === userId ? null : userId);
    };

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Users</h2>

            <div className="flex justify-between items-center mb-4">
                <Count count={filteredUsers.length} title="Tổng số người dùng" />
                <div className="flex items-center">
                    <InputSearch
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        placeholder="Tìm kiếm người dùng..."
                    />
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

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <TableHeader headers={headers} />
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.userId} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b w-1/4">
                                    <div className="flex items-center">
                                        <img src={`${BASE_URL}${user.photo}`} alt={user.fullname} className="h-8 w-8 rounded-full mr-2" />
                                        <div className="overflow-hidden">
                                            <div className="font-semibold truncate">{user.fullname}</div>
                                            <div className="text-gray-500 text-sm truncate">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b w-1/4">
                                    <div className="flex flex-wrap items-center gap-1">
                                        {user.userType && user.userType.split(", ").map((type, index) => (
                                            <span key={index} className={`px-2 py-1 rounded-full text-sm ${type === 'Admin' ? 'bg-red-100 text-red-800' :
                                                    type === 'Instructor' ? 'bg-green-100 text-green-800' :
                                                        type === 'Student' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {type}
                                            </span>
                                        ))}
                                        {user.userType === null && (
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">N/A</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b w-1/4">
                                    <span className={`px-2 py-1 rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        user.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                            user.status === null ? 'bg-gray-100 text-gray-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.status || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-2 px-4 border-b w-1/4">
                                    <div className="flex justify-between items-center">
                                        <span>{new Date(user.startDate).toLocaleDateString()}</span>
                                        <button
                                            onClick={(e) => handleMoreVerticalClick(e, user.userId)}
                                            className="p-1 hover:bg-gray-200 rounded-full"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {activeDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                    }}
                >
                    <div className="py-1 max-h-48 overflow-y-auto">
                        {handleMoreOptions(users.find(user => user.userId === activeDropdown)).map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    option.action();
                                    setActiveDropdown(null);
                                }}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
            {showProfile && selectedUser && (
                <ProfileView
                    user={selectedUser}
                    onClose={() => {
                        setShowProfile(false);
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
}

export default ClientUsers;

