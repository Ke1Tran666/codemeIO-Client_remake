import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MoreVertical, Eye, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API, BASE_URL } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import Pagination from '../../../../components/Pagination/Pagination';
import Count from '../../../../components/Count/Count';
import InputSearch from '../../../../components/Search/Search';
import TableHeader from '../../../../components/Table/TableHeader';
import ProfileView from '../../../../components/Form/ViewProfileForm';
import EditProfileForm from '../../../../components/Form/EditProfileForm';
import AddProfileForm from '../../../../components/Form/AddProfileForm';

const ClientUserRoles = () => {
    const { roleName } = useParams();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [, setCurrentUser] = useState({
        userId: '',
        fullname: '',
        email: '',
        phone: '',
        password: '',
        photo: '',
        specialization: '',
        yearsOfExperience: '',
        department: '',
        roles: []
    });
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add');
    const { showNotification } = useNotification();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [showProfile, setShowProfile] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;
    const headers = ['User', 'Access', 'Status', 'Date Added'];

    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userResponse = await axios.get(`${BASE_URL_API}/users`);
                const usersData = userResponse.data;

                const usersWithRoles = await Promise.all(
                    usersData.map(async (user) => {
                        try {
                            const rolesResponse = await axios.get(`${BASE_URL_API}/userRoles/users/${user.userId}`);
                            const roles = Array.isArray(rolesResponse.data) ? rolesResponse.data.map(role => role?.roleName).filter(role => role) : [];
                            return { ...user, roles };
                            // eslint-disable-next-line no-unused-vars
                        } catch (error) {
                            console.error("Error fetching roles for user:", user.userId);
                            return { ...user, roles: [] };
                        }
                    })
                );

                const filteredUsersWithRole = usersWithRoles.filter(user => user.roles.includes(roleName));
                setUsers(filteredUsersWithRole);
                setFilteredUsers(filteredUsersWithRole);
            } catch (error) {
                console.error('Error fetching users:', error);
                showNotification('error', 'Error loading data', 'Unable to fetch user information.');
            }
        };

        fetchUsers();
    }, [showNotification, roleName]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term) {
            setFilteredUsers(users);
            setCurrentPage(1);
            return;
        }

        const filtered = users.filter(user =>
            user.fullname?.toLowerCase().includes(term.toLowerCase()) ||
            user.email?.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleAddUser = async (userData) => {
        try {
            const dataToSend = {
                username: userData.username,
                password: userData.password,
                email: userData.email,
                fullname: userData.fullname,
                phone: userData.phone,
                gender: userData.gender,
                specialization: userData.specialization || '',
                yearsOfExperience: userData.yearsOfExperience || '',
                status: userData.status || 'Active',
                roles: userData.roles || [],
            };

            const response = await axios.post(`${BASE_URL_API}/users`, dataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const newUserId = response.data?.userId;

            await handleRoleUpdate(newUserId, userData.roles || []);

            if (userData.photo) {
                const formData = new FormData();
                formData.append('file', userData.photo);
                await axios.put(`${BASE_URL_API}/users/${newUserId}/image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            setUsers((prevUsers) => [...prevUsers, response.data]);
            setFilteredUsers((prevFiltered) => [...prevFiltered, response.data]);
            showNotification('success', 'Success', 'User has been added.');
            setShowForm(false);
        } catch (error) {
            console.error('Error adding user:', error);
            showNotification('error', 'Error', error.response?.data?.message || 'Unable to add user.');
        }
    };

    const handleRoleUpdate = async (userId, roles) => {
        try {
            await axios.put(`${BASE_URL_API}/userRoles/users/${userId}`, { newRoles: roles });
            showNotification('success', 'Success', 'User roles have been updated.');
        } catch (error) {
            console.error('Error updating user roles:', error);
            showNotification('error', 'Error', error.response?.data?.message || 'Unable to update user roles.');
        }
    };

    const handleSubmit = async (userData) => {
        try {
            const dataToSend = {
                ...userData,
                roles: userData.roles || [],
            };

            let response;
            if (formAction === 'add') {
                response = await axios.post(`${BASE_URL_API}/users`, dataToSend);
                setUsers((prevUsers) => [...prevUsers, response.data]);
                setFilteredUsers((prevFiltered) => [...prevFiltered, response.data]);
                showNotification('success', 'Success', 'User has been added.');
            } else if (formAction === 'edit') {
                const userId = userData.userId;
                response = await axios.put(`${BASE_URL_API}/users/${userId}`, dataToSend);
                setUsers((prevUsers) => prevUsers.map(user => (user.userId === userId ? response.data : user)));
                setFilteredUsers((prevFiltered) => prevFiltered.map(user => (user.userId === userId ? response.data : user)));
                showNotification('success', 'Success', 'User has been updated.');
                await handleRoleUpdate(userId, userData.roles);
            }

            setCurrentUser({
                userId: '',
                fullname: '',
                email: '',
                phone: '',
                password: '',
                photo: '',
                specialization: '',
                yearsOfExperience: '',
                department: '',
                roles: [],
                status: 'Active'
            });
            setShowForm(false);
            setShowEditForm(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Error', 'Unable to perform the operation.');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${BASE_URL_API}/users/${userId}`);
            setUsers((prevUsers) => prevUsers.filter(user => user.userId !== userId));
            setFilteredUsers((prevFiltered) => prevFiltered.filter(user => user.userId !== userId));
            showNotification('success', 'Success', 'User has been deleted.');
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification('error', 'Error deleting user', 'Unable to delete the user.');
        }
    };

    const handleMoreOptions = (user) => {
        return [
            {
                label: 'View profile',
                action: () => {
                    setSelectedUser(user);
                    setShowProfile(true);
                },
                icon: <Eye className="h-4 w-4 mr-2" />
            },
            {
                label: 'Edit details',
                action: () => {
                    setSelectedUser(user);
                    setCurrentUser({
                        ...user,
                        roles: user.roles || []
                    });
                    setShowEditForm(true);
                    setFormAction('edit');
                },
                icon: <Edit className="h-4 w-4 mr-2" />
            },
            { label: 'Delete user', action: () => handleDeleteUser(user.userId), icon: <Trash className="h-4 w-4 mr-2" /> },
        ];
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
            <h2 className="text-2xl font-bold mb-4">Users with {roleName} Role</h2>

            <div className="flex justify-between items-center mb-4">
                <Count count={filteredUsers.length} title="Total Users" />
                <div className="flex items-center">
                    <InputSearch
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        placeholder="Search users..."
                    />
                </div>
            </div>

            {showForm && (
                <AddProfileForm
                    onClose={() => setShowForm(false)}
                    onSave={handleAddUser}
                />
            )}

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <TableHeader headers={headers} />
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={`${user.userId}-${index}`} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b w-1/4">
                                    <div className="flex items-center">
                                        <img src={`${BASE_URL}${user.photo || 'default-avatar.jpg'}`} alt={user.fullname} className="h-8 w-8 rounded-full mr-2" />
                                        <div className="overflow-hidden">
                                            <div className="font-semibold truncate">{user.fullname}</div>
                                            <div className="text-gray-500 text-sm truncate">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b w-1/4">
                                    <div className="flex flex-wrap items-center gap-1">
                                        {Array.isArray(user.roles) && user.roles.length > 0 ? (
                                            user.roles.map((role, index) => (
                                                <span key={`${user.userId}-${role}-${index}`} className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                                                    {role}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">N/A</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b w-1/4">
                                    <span className={`px-2 py-1 rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : user.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
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
                                key={`${activeDropdown}-${option.label}-${index}`}
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
            {showEditForm && selectedUser && (
                <EditProfileForm
                    user={selectedUser}
                    onClose={() => {
                        setShowEditForm(false);
                        setSelectedUser(null);
                    }}
                    onSave={handleSubmit}
                />
            )}
        </div>
    );
}

export default ClientUserRoles;