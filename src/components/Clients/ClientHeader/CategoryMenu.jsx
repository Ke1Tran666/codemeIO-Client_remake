import { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, Star, Calendar, Folder, Menu } from 'lucide-react';

function ResponsiveMenu() {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const toggleMenu = () => setIsOpen((prev) => !prev);

    const menuItems = [
        { name: 'Xu hướng', icon: TrendingUp },
        { name: 'Nổi bật', icon: Star },
        { name: 'Sắp ra mắt', icon: Calendar },
        { name: 'Danh mục', icon: Folder },
    ];

    return (
        <div className="font-sans text-base leading-relaxed text-black">
            <div className="relative inline-block">
                <button
                    onClick={toggleMenu}
                    className={`flex items-center justify-center gap-3 px-6 py-3 md:px-9 rounded-t-2xl transition-all duration-500 ease-in-out overflow-hidden relative ${isOpen ? 'text-white' : ''
                        }`}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                >
                    {isMobile ? (
                        <Menu className="w-6 h-6 relative z-10" aria-label="Menu" />
                    ) : (
                        <>
                            <span className="relative z-10">Khám phá</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''
                                    } relative z-10`}
                                aria-hidden="true"
                            />
                        </>
                    )}
                    <div
                        className={`absolute inset-0 bg-blue-600 transform ${isOpen ? 'scale-x-100' : 'scale-x-0'
                            } origin-left transition-transform duration-500 ease-in-out`}
                    ></div>
                </button>
                {isOpen && (
                    <div className="absolute top-full left-0 w-full overflow-hidden opacity-100 visible transform translate-y-0 transition-all duration-500 ease-in-out z-20">
                        <div className="bg-white border border-blue-600 rounded-b-2xl overflow-hidden">
                            {menuItems.map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="flex items-center gap-2 py-3 px-6 text-center transition-all duration-500 ease-in-out relative overflow-hidden hover:text-blue-600 group justify-center md:justify-start"
                                >
                                    <div className="relative">
                                        <item.icon className="w-4 h-4" aria-hidden={!isMobile} />
                                        {isMobile && (
                                            <span
                                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 m-auto px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-50"
                                            >
                                                {item.name}
                                            </span>
                                        )}
                                    </div>
                                    {!isMobile && <span className="relative z-10">{item.name}</span>}
                                    {isMobile && <span className="sr-only">{item.name}</span>}
                                </a>
                            ))}

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResponsiveMenu;
