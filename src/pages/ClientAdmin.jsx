import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ClientHeader from '../components/Clients/ClientHeader/ClientHeader';
import { Outlet } from 'react-router-dom';

function ClientAdmin() {
    const [activeMenu, setActiveMenu] = useState('Overview');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
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

