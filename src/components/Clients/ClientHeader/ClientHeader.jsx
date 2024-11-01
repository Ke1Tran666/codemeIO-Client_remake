import ElectroLogo from "../../ElectroLogo/ElectroLogo";

/* eslint-disable react/no-unknown-property */
const ClientHeader = () => {
    return (
        <header className="bg-[#fff] shadow-custom-1 leading-[24.8px] mb-[32px]">
            <div className="leading-[24.8px] mx-auto px-4 max-w-[1320px]">
                <div className="flex flex-wrap items-center justify-between gap-0 leading-[24.8px] py-4">
                    <ElectroLogo />
                    <div className="flex items-center relative max-w-[300px] leading-7">
                        <svg ariaHidden='true' className="absolute left-4 fill-[#9e9ea7] w-4 h-4" viewBox="0 0 24 24">
                            <path d="m21.53 20.47-3.66-3.66A8.98 8.98 0 0 0 20 11a9 9 0 1 0-9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66a.746.746 0 0 0 1.06 0 .747.747 0 0 0 .002-1.06M3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5"></path>
                        </svg>
                        <input type="text" className="w-full h-10 leading-7 px-4 pl-10 border-2 border-transparent rounded-lg outline-none bg-[#f3f3f4] text-[#0d0c22] transition ease duration-300 placeholder-[#9e9ea7] focus:outline-none focus:border-[rgba(44,143,255,0.4)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(44,143,255,0.1)] hover:border-[rgba(44,143,255,0.4)] hover:outline-none hover:bg-white" placeholder="Bạn tìm gì..." />
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-2 leading-[24.8px]">
                        <button type="button" className="flex flex-wrap items-center justify-start gap-2 bg-[#f8f9fa] rounded-lg leading-[18.4px] p-[10px_12px] text-left  relative hover:shadow-[0_0.5em_1.5em_-0.5em_rgba(88,71,116,0.627)] active:shadow-[0_0.3em_1em_-0.5em_rgba(88,71,116,0.627)] Download-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                        </button>
                        <button type="button" className="flex flex-wrap items-center justify-start gap-2 bg-[#f8f9fa] rounded-lg leading-[18.4px] p-[10px_12px] text-left  relative hover:shadow-[0_0.5em_1.5em_-0.5em_rgba(88,71,116,0.627)] active:shadow-[0_0.3em_1em_-0.5em_rgba(88,71,116,0.627)] Download-button">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default ClientHeader;