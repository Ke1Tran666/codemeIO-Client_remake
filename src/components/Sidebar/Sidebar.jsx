import { LayoutDashboard, BookOpen, FileText, Users, UserCircle, GraduationCap, School, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

// eslint-disable-next-line react/prop-types
function Sidebar({ activeMenu, setActiveMenu, isUserMenuOpen, setIsUserMenuOpen }) {
    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard },
        { name: 'Courses', icon: BookOpen },
        { name: 'Category', icon: FileText },
        {
            name: 'User',
            icon: Users,
            subItems: [
                { name: 'Student', icon: GraduationCap },
                { name: 'Instructor', icon: School },
                { name: 'Admin', icon: ShieldCheck },
            ],
        },
        { name: 'Roles', icon: UserCircle },
    ];

    function handleMenuClick(menuName) {
        if (menuName === 'User') {
            setIsUserMenuOpen(!isUserMenuOpen);
        } else {
            setActiveMenu(menuName);
            if (menuName !== 'Student' && menuName !== 'Instructor' && menuName !== 'Admin') {
                setIsUserMenuOpen(false);
            }
        }
    }

    return (
        <div className="w-64 bg-white text-black px-2">
            <div className="p-4">
                <h1 className="text-2xl font-bold">Course Admin</h1>
            </div>
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <div key={item.name} className="flex flex-col">
                        <button
                            className={`flex items-center justify-between w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-gray-600 rounded-lg ${activeMenu === item.name || (item.name === 'User' && isUserMenuOpen) ? 'bg-blue-500 text-white' : ''
                                }`}
                            onClick={() => handleMenuClick(item.name)}
                        >
                            <div className="flex items-center">
                                <item.icon className="mr-2 h-5 w-5" />
                                {item.name}
                            </div>
                            {item.subItems && (
                                isUserMenuOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                            )}
                        </button>
                        {item.subItems && isUserMenuOpen && (
                            <div className=" p-2 bg-slate-100 rounded-lg">
                                <div className="flex flex-col gap-2">
                                    {item.subItems.map((subItem) => (
                                        <button
                                            key={subItem.name}
                                            className={`flex items-center w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-gray-600 rounded-lg ${activeMenu === subItem.name ? 'bg-blue-500 text-white' : ''
                                                }`}
                                            onClick={() => handleMenuClick(subItem.name)}
                                        >
                                            <subItem.icon className="mr-2 h-5 w-5" />
                                            {subItem.name}
                                        </button>
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

