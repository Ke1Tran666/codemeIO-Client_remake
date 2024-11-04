// import
import { useState, useEffect, useRef } from "react";

// logo
import ElectroLogo from "../../ElectroLogo/ElectroLogo";

const ClientHeader = () => {

    const [isAccountDropdownOpen, setAccountDropdownOpen] = useState(false);
    const accountRef = useRef(null);

    const toggleAccountDropdown = () => {
        setAccountDropdownOpen(!isAccountDropdownOpen);
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

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAccountDropdownOpen]);

    return (
        <header className="bg-white shadow-custom-1 mb-8">
            <div className="mx-auto px-4 max-w-[1320px]">
                <div className="flex flex-wrap items-center justify-between py-4">
                    <ElectroLogo />
                    <div className="relative max-w-[300px]">
                        <svg
                            aria-hidden="true"
                            className="absolute left-4 top-1/2 -translate-y-1/2 fill-[#9e9ea7] w-4 h-4"
                            viewBox="0 0 24 24"
                        >
                            <path d="m21.53 20.47-3.66-3.66A8.98 8.98 0 0 0 20 11a9 9 0 1 0-9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66a.746.746 0 0 0 1.06 0 .747.747 0 0 0 .002-1.06M3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5"></path>
                        </svg>
                        <input
                            type="text"
                            className="w-full h-10 px-4 pl-10 rounded-lg bg-[#f3f3f4] text-[#0d0c22] placeholder-[#9e9ea7] transition duration-300 ease-in-out border-2 border-transparent focus:outline-none focus:border-[rgba(44,143,255,0.4)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(44,143,255,0.1)] hover:border-[rgba(44,143,255,0.4)] hover:bg-white"
                            placeholder="Bạn tìm gì..."
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative group">
                            <button
                                type="button"
                                className="download-button flex items-center gap-2 bg-[#f8f9fa] rounded-lg p-3 hover:shadow-[0_0.5em_1.5em_-0.5em_rgba(88,71,116,0.627)] active:shadow-[0_0.3em_1em_-0.5em_rgba(88,71,116,0.627)] relative overflow-hidden"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                    />
                                </svg>
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
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            </button>
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                Tài khoản
                            </span>

                            {isAccountDropdownOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg py-2 z-10">
                                    <a href="/signin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Đăng nhập
                                    </a>
                                    <a href="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Đăng ký
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ClientHeader;
