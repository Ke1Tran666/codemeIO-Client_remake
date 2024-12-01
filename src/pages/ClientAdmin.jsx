import { Outlet } from "react-router-dom"; // Đảm bảo import đúng
import Sidebar from "../components/Sidebar/Sidebar";
import ClientHeader from "../components/Clients/ClientHeader/ClientHeader"

const ClientAdmin = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1">
                <ClientHeader />
                <main className="p-4"> {/* Thêm padding hoặc margin nếu cần */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ClientAdmin;