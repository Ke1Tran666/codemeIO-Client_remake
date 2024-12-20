import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Users, UserCircle, ChevronDown, ChevronUp, List } from 'lucide-react';
import { BASE_URL_API } from '../../api/config';
import ElectroLogo from '../ElectroLogo/ElectroLogo';

function Sidebar() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isRolesMenuOpen, setIsRolesMenuOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const location = useLocation();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await fetch(`${BASE_URL_API}/roles`);
            if (response.ok) {
                const data = await response.json();
                setRoles(data);
            } else {
                console.error('Failed to fetch roles');
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/overview' },
        { name: 'Category', icon: FileText, path: '/category' },
        { name: 'Courses', icon: BookOpen, path: '/courses' },
        { name: 'Lessons', icon: BookOpen, path: '/lessons' },
        {
            name: 'User',
            icon: Users,
            subItems: [
                { name: 'All Users', icon: List, path: '/users' },
                {
                    name: 'Roles',
                    icon: UserCircle,
                    subItems: [
                        { name: 'All Roles', icon: List, path: '/roles' },
                        ...roles.map(role => ({ name: role.roleName, path: `/roles/${role.roleName}`, isDot: true }))
                    ]
                },
            ],
        },
    ];

    const renderMenuItem = (item, depth = 0) => (
        <div key={item.name} className={`ml-${depth * 4}`}>
            {item.subItems ? (
                <>
                    <button
                        className={`flex items-center justify-between w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-gray-600 rounded-lg ${(depth === 0 ? isUserMenuOpen : isRolesMenuOpen) || item.subItems.some(subItem => location.pathname === `/admin${subItem.path}`)
                            ? 'bg-blue-500 text-white'
                            : ''
                            }`}
                        onClick={() => depth === 0 ? setIsUserMenuOpen(!isUserMenuOpen) : setIsRolesMenuOpen(!isRolesMenuOpen)}
                    >
                        <div className="flex items-center gap-2">
                            {item.icon && <item.icon className=" h-5 w-5" />}
                            {item.name}
                        </div>
                        {(depth === 0 ? isUserMenuOpen : isRolesMenuOpen) ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                    </button>
                    {(depth === 0 ? isUserMenuOpen : isRolesMenuOpen) && (
                        <div className="p-2 bg-slate-100 rounded-lg mt-1 flex flex-col gap-2">
                            {item.subItems.map(subItem => renderMenuItem(subItem, depth + 1))}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    to={`/admin${item.path}`}
                    className={`flex items-center w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-gray-600 rounded-lg gap-2 ${location.pathname === `/admin${item.path}` ? 'bg-blue-500 text-white' : ''
                        }`}
                >
                    {item.icon && <item.icon className=" h-5 w-5" />}
                    {item.isDot && (
                        <div className="w-5 h-5 flex justify-center items-center">
                            <span className=" h-2 w-2 bg-gray-400 rounded-full"></span>
                        </div>
                    )}
                    {item.name}
                </Link>
            )}
        </div>
    );

    return (
        <div className="w-64 bg-white text-black px-2 border-r border-gray-200">
            <div className="p-5">
                <a href='/' className="flex items-center justify-center gap-2">
                    <ElectroLogo />
                </a>
                {/* <h1 className="text-2xl font-bold">Course Admin</h1> */}
            </div>
            <nav className="flex flex-col gap-2">
                {menuItems.map(item => renderMenuItem(item))}
            </nav>
        </div>
    );
}

export default Sidebar;

