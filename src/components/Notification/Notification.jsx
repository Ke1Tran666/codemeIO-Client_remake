/* eslint-disable react/prop-types */
import { Check, X, AlertCircle } from 'lucide-react';

const Notification = ({ type = "success", message = "Operation completed", description = "Action was successful" }) => {
    const iconColor = type === 'success' ? 'text-[#2b9875]' : 'text-[#e74c3c]';
    const Icon = type === 'success' ? Check : AlertCircle;

    return (
        <div className="flex flex-col gap-2 w-60 sm:w-72 text-[10px] sm:text-xs z-50">
            <div className="notification-alert cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg bg-[#232531] px-[10px]">
                <div className="flex gap-2">
                    <div className={`${iconColor} bg-white/5 backdrop-blur-xl p-1 rounded-lg`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-white">{message}</p>
                        <p className="text-gray-500">{description}</p>
                    </div>
                </div>
                <button className="text-gray-600 hover:bg-white/5 p-1 rounded-md transition-colors ease-linear">
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

export default Notification;