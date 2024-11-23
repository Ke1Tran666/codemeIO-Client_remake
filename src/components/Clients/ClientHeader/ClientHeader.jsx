import { useState, useEffect, useRef } from "react";
import { Bell, CircleUserRound, Search } from "lucide-react";
import ElectroLogo from "../../ElectroLogo/ElectroLogo";
import CategoryMenu from "./CategoryMenu";

const ClientHeader = () => {
    const [isAccountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const accountRef = useRef(null);

    // Kiểm tra trạng thái đăng nhập khi component được mount
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setIsLoggedIn(true);
            setUsername(parsedUser.username);
        }
    }, []);

    const toggleAccountDropdown = () => {
        setAccountDropdownOpen(!isAccountDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
    };

    const handleClickOutside = (event) => {
        if (accountRef.current && !accountRef.current.contains(event.target)) {
            setAccountDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (isAccountDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAccountDropdownOpen]);

    return (
        <header className="bg-white shadow-custom-1 mb-8">
            <div className="mx-auto px-4 max-w-[1320px]">
                <div className="flex flex-wrap items-center justify-between py-4">
                    <a href='/' className="flex items-center justify-center gap-2">
                        <ElectroLogo />
                    </a>
                    <div className="relative max-w-[300px] hidden md:block">
                        <div className="relative max-w-[300px] group flex-1 md:max-w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9e9ea7] w-4 h-4 pointer-events-none transition-colors group-focus-within:text-[#0d0c22]" />
                            <input
                                type="text"
                                className="w-full h-10 px-4 pl-10 rounded-lg bg-[#f3f3f4] text-[#0d0c22] placeholder-[#9e9ea7] transition duration-300 ease-in-out border-2 border-transparent focus:outline-none focus:border-[rgba(44,143,255,0.4)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(44,143,255,0.1)] hover:border-[rgba(44,143,255,0.4)] hover:bg-white"
                                placeholder="Bạn tìm gì..."
                            />
                        </div>
                    </div>
                    <CategoryMenu />
                    <div className="hidden md:block">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative group">
                                <button
                                    type="button"
                                    className="download-button flex items-center gap-2 bg-[#f8f9fa] rounded-lg p-3 hover:shadow-[0_0.5em_1.5em_-0.5em_rgba(88,71,116,0.627)] active:shadow-[0_0.3em_1em_-0.5em_rgba(88,71,116,0.627)] relative overflow-hidden"
                                >
                                    <Bell className="w-6 h-6" />
                                </button>
                                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    Thông báo
                                </span>
                            </div>
                            <div className="relative group" ref={accountRef}>
                                <button
                                    type="button"
                                    onClick={toggleAccountDropdown}
                                    className="download-button flex items-center gap-2 bg-[#f8f9fa] rounded-lg p-3 hover:shadow-[0_0.5em_1.5em_-0.5em_rgba(88,71,116,0.627)] active:shadow-[0_0.3em_1em_-0.5em_rgba(88,71,116,0.627)] relative overflow-hidden"
                                >
                                    <CircleUserRound className="w-6 h-6" />
                                </button>
                                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    {isLoggedIn ? `Hello, ${username}` : 'Tài khoản'}
                                </span>

                                {isAccountDropdownOpen && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-10">
                                        {isLoggedIn ? (
                                            <>
                                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Học tập
                                                </a>
                                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Hồ sơ
                                                </a>
                                                <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                                    Đăng xuất
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <a href="/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Đăng nhập
                                                </a>
                                                <a href="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Đăng ký
                                                </a>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ClientHeader;