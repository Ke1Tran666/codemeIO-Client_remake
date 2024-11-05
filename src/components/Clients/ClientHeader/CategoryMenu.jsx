import { ChevronDown, TrendingUp, Star, Calendar, Folder } from 'lucide-react';

const CategoryMenu = () => {
    const menuItems = [
        { name: 'Xu hướng', icon: TrendingUp },
        { name: 'Nổi bật', icon: Star },
        { name: 'Sắp ra mắt', icon: Calendar },
        { name: 'Danh mục', icon: Folder },
    ];

    return (
        <div className="font-sans text-base leading-relaxed text-black">
            <div className="relative inline-block group">
                <a href="#" className="flex items-center justify-center gap-3 px-9 py-3 rounded-t-2xl transition-all duration-500 ease-in-out overflow-hidden relative hover:text-white">
                    <span className="relative z-10">Khám phá</span>
                    <ChevronDown className="w-3.5 h-3.5 transition-transform duration-500 ease-in-out group-hover:rotate-180 relative z-10" />
                    <div className="absolute inset-0 bg-blue-600 transform scale-x-0 origin-left transition-transform duration-500 ease-in-out group-hover:scale-x-100"></div>
                </a>
                <div className="absolute top-full left-0 w-full overflow-hidden opacity-0 invisible transform -translate-y-3 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-20">
                    <div className="bg-white border border-blue-600 rounded-b-2xl overflow-hidden">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href="#"
                                className="flex items-center gap-2 py-3 px-6 text-center transition-all duration-500 ease-in-out relative overflow-hidden hover:text-blue-600"
                            >
                                <item.icon className="w-4 h-4 text-blue-600" />
                                <span className="relative z-10">{item.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryMenu;
