import { BarChart, Users, BookOpen, Settings } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('/admin');

    const menuItems = [
        { href: '/admin', icon: BarChart, label: 'Dashboard' },
        { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
        { href: '/admin/users', icon: Users, label: 'Users' },
        { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="bg-white text-black w-64 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out shadow-custom-1">
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={`flex items-center py-2.5 px-4 rounded transition duration-200 
                            ${activeItem === item.href
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-blue-100 hover:text-gray-600'}`}
                        onClick={() => setActiveItem(item.href)}
                    >
                        <item.icon className="mr-2" size={20} />
                        {item.label}
                    </a>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar;

