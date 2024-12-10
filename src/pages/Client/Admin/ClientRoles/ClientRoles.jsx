import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, MoreVertical, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import Pagination from '../../../../components/Pagination/Pagination';
import Count from '../../../../components/Count/Count';
import InputSearch from '../../../../components/Search/Search';
import TableHeader from '../../../../components/Table/TableHeader';
import RoleForm from '../../../../components/Form/RoleForm';

const ClientRoles = () => {
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentRole, setCurrentRole] = useState({
        roleId: '',
        roleName: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add');
    const { showNotification } = useNotification();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const [currentPage, setCurrentPage] = useState(1);
    const rolesPerPage = 8;
    const headers = ['Role Name', ''];

    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/roles`);
                setRoles(response.data);
                setFilteredRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                showNotification('error', 'Error loading data', 'Unable to fetch role information.');
            }
        };

        fetchRoles();
    }, [showNotification]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term) {
            setFilteredRoles(roles);
            setCurrentPage(1);
            return;
        }

        const filtered = roles.filter(role =>
            role.roleName.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredRoles(filtered);
        setCurrentPage(1);
    };

    const handleSubmit = async (roleData) => {
        try {
            let response;
            if (formAction === 'add') {
                response = await axios.post(`${BASE_URL_API}/roles`, roleData);
                setRoles([...roles, response.data]);
                setFilteredRoles([...filteredRoles, response.data]);
                showNotification('success', 'Success', 'Role has been added.');
            } else if (formAction === 'edit') {
                response = await axios.put(`${BASE_URL_API}/roles/${roleData.roleId}`, roleData);
                setRoles(roles.map(role => (role.roleId === roleData.roleId ? response.data : role)));
                setFilteredRoles(filteredRoles.map(role => (role.roleId === roleData.roleId ? response.data : role)));
                showNotification('success', 'Success', 'Role has been updated.');
            }
            setCurrentRole({ roleId: '', roleName: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Error', 'Unable to perform the operation.');
        }
    };

    const handleDeleteRole = async (roleId) => {
        try {
            await axios.delete(`${BASE_URL_API}/roles/${roleId}`);
            setRoles(roles.filter(role => role.roleId !== roleId));
            setFilteredRoles(filteredRoles.filter(role => role.roleId !== roleId));
            showNotification('success', 'Success', 'Role has been deleted.');
        } catch (error) {
            console.error('Error deleting role:', error);
            showNotification('error', 'Error deleting role', 'Unable to delete the role.');
        }
    };

    const handleMoreOptions = (role) => {
        return [
            {
                label: 'Edit role',
                action: () => {
                    setCurrentRole(role);
                    setShowForm(true);
                    setFormAction('edit');
                },
                icon: <Edit className="h-4 w-4 mr-2" />
            },
            { label: 'Delete role', action: () => handleDeleteRole(role.roleId), icon: <Trash className="h-4 w-4 mr-2" /> },
        ];
    };

    const indexOfLastRole = currentPage * rolesPerPage;
    const indexOfFirstRole = indexOfLastRole - rolesPerPage;
    const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
    const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

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

    const handleMoreVerticalClick = (event, roleId) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 100;

        setDropdownPosition({
            top: spaceBelow > dropdownHeight || spaceBelow > spaceAbove
                ? rect.bottom + window.scrollY
                : rect.top - dropdownHeight + window.scrollY,
            left: rect.right - 192 + window.scrollX
        });
        setActiveDropdown(activeDropdown === roleId ? null : roleId);
    };

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Roles</h2>

            <div className="flex justify-between items-center mb-4">
                <Count count={filteredRoles.length} title="Total Roles" />
                <div className="flex items-center">
                    <InputSearch
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        placeholder="Search roles..."
                    />
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setFormAction('add');
                            setCurrentRole({ roleId: '', roleName: '' });
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Role
                    </button>
                </div>
            </div>

            {showForm && (
                <RoleForm
                    role={currentRole}
                    onClose={() => setShowForm(false)}
                    onSave={handleSubmit}
                    formAction={formAction}
                />
            )}

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <TableHeader headers={headers} />
                    <tbody>
                        {currentRoles.map(role => (
                            <tr key={role.roleId} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">
                                    <div className="font-semibold">{role.roleName}</div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={(e) => handleMoreVerticalClick(e, role.roleId)}
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
                    <div className="py-1">
                        {handleMoreOptions(roles.find(role => role.roleId === activeDropdown)).map((option) => (
                            <button
                                key={`${activeDropdown}-${option.label}`}
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
        </div>
    );
}

export default ClientRoles;