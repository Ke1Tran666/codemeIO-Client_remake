import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ClientHeader from '../components/Clients/ClientHeader/ClientHeader';

function ClientAdmin() {
    const [activeMenu, setActiveMenu] = useState('Overview');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    function renderContent() {
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{activeMenu}</h2>
                <p>Content for {activeMenu} goes here.</p>
            </div>
        );
    }

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
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default ClientAdmin;

