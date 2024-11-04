import { useState } from 'react';

const ClientSignIn = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="max-w-xs mx-auto p-6 bg-gradient-to-t from-white to-[#f4f7fb] rounded-3xl border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] my-5">
            <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">Đăng nhập</h2>

            <form className="mt-5 space-y-4">
                <div>
                    <label htmlFor="account" className="sr-only">Tài khoản</label>
                    <input
                        placeholder="Tài khoản"
                        id="account"
                        name="account"
                        type="text"
                        className="w-full bg-white border-none p-4 rounded-lg mt-4 shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                        aria-required="true"
                    />
                </div>
                <div className="relative mt-4">
                    <label htmlFor="password" className="sr-only">Mật khẩu</label>
                    <input
                        placeholder="Mật khẩu"
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full bg-white border-none p-4 rounded-lg shadow-[0_10px_10px_-5px_#cff0ff] placeholder-gray-400 focus:outline-none focus:border-[#12b1d1]"
                        required
                        aria-required="true"
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>


                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="flex justify-end">
                    <a href="#" className="text-xs text-[#0099ff] transition-all duration-200 hover:underline hover:underline-offset-4">
                        Quên mật khẩu?
                    </a>
                </div>
                <button
                    type="submit"
                    className="w-full font-bold text-white py-4 mt-5 rounded-lg bg-gradient-to-r from-[#1089d3] to-[#12b1d1] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
                >
                    Đăng nhập
                </button>
            </form>

            <div className="text-center mt-4">
                <a href="/signup" className="text-xs text-[#0099ff] transition-all duration-200 hover:underline hover:underline-offset-4">
                    Không có tài khoản? Đăng ký ngay
                </a>
            </div>
        </div>
    );
};

export default ClientSignIn;
