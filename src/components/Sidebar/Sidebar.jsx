import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Users, UserCircle, GraduationCap, School, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

function Sidebar() {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/overview' },
        { name: 'Category', icon: FileText, path: '/category' },
        { name: 'Courses', icon: BookOpen, path: '/courses' },
        {
            name: 'User',
            icon: Users,
            subItems: [
                { name: 'Student', icon: GraduationCap, path: '/users/student' },
                { name: 'Instructor', icon: School, path: '/users/instructor' },
                { name: 'Admin', icon: ShieldCheck, path: '/users/admin' },
            ],
        },
        { name: 'Roles', icon: UserCircle, path: '/roles' },
    ];

    return (
        <div className="w-64 bg-white text-black px-2">
            <div className="p-4">
                <h1 className="text-2xl font-bold">Course Admin</h1>
            </div>
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <div key={item.name}>
                        {item.path ? (
                            <Link
                                to={`/admin${item.path}`}
                                className={`flex items-center justify-between w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-gray-600 rounded-lg ${location.pathname === `/admin${item.path}` ? 'bg-blue-500 text-white' : ''
                                    }`}
                            >
                                <div className="flex items-center">
                                    <item.icon className="mr-2 h-5 w-5" />
                                    {item.name}
                                </div>
                            </Link>
                        ) : (
                            <button
                                className={`flex items-center justify-between w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-gray-600 rounded-lg ${isUserMenuOpen || item.subItems.some(subItem => location.pathname === `/admin${subItem.path}`)
                                    ? 'bg-blue-500 text-white'
                                    : ''
                                    }`}
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                <div className="flex items-center">
                                    <item.icon className="mr-2 h-5 w-5" />
                                    {item.name}
                                </div>
                                {isUserMenuOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                            </button>
                        )}
                        {item.subItems && isUserMenuOpen && (
                            <div className=" p-2 bg-slate-100 rounded-lg">
                                <div className="flex flex-col gap-2">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.name}
                                            to={`/admin${subItem.path}`}
                                            className={`flex items-center w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-gray-600 rounded-lg ${location.pathname === `/admin${subItem.path}` ? 'bg-blue-500 text-white' : ''
                                                }`}
                                        >
                                            <subItem.icon className="mr-2 h-5 w-5" />
                                            {subItem.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;

