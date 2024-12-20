import { Link, useLocation } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    const location = useLocation();
    const isAdminPage = location.pathname.includes('/admin');

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-600 mb-4">Trang không tồn tại</h2>
                <p className="text-gray-500 mb-8">
                    Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>
                {!isAdminPage && (
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out"
                    >
                        <Home className="w-5 h-5 mr-2" />
                        Trở về trang chủ
                    </Link>
                )}
            </div>
        </div>
    );
};

export default NotFound;