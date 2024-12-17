import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import ClientHeader from '../components/Clients/ClientHeader/ClientHeader';
import { Outlet } from 'react-router-dom';

function ClientAdmin() {
    const [activeMenu, setActiveMenu] = useState('Overview');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            const userRoles = parsedUser.roles || [];

            // Kiểm tra xem người dùng có chỉ 1 vai trò và vai trò đó là student không
            if (userRoles.length === 1 && userRoles[0].roleName === 'Student') {
                navigate('/'); // Điều hướng ra trang khác nếu chỉ có 1 vai trò là student
            }
        } else {
            // Nếu không có người dùng, điều hướng về trang đăng nhập
            navigate('/signin');
        }
    }, [navigate]);

    return (
        <div className="flex h-screen bg-gray-50 w-full">
            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-x-hidden">
                <ClientHeader />
                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default ClientAdmin;