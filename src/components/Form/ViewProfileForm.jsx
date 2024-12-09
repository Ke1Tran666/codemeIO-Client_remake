/* eslint-disable react/prop-types */
import { User, X, Briefcase, Clock } from 'lucide-react';

import { BASE_URL } from '../../api/config'

// eslint-disable-next-line react/prop-types
const ViewProfile = ({ user, onClose }) => {
    const {
        userId,
        username,
        fullname,
        email,
        photo,
        startDate,
        gender,
        userType,
        status,
        specialization,
        yearsOfExperience
    } = user;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const isInstructor = userType && userType.split(", ").includes('Instructor');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-auto max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">Profile</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close profile view"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {/* Profile Photo and User Info */}
                    <div className="col-span-full flex items-center gap-4 mb-4">
                        <div className="relative">
                            <img
                                src={`${BASE_URL}${photo}`}
                                alt={`${fullname}'s profile`}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md flex items-center gap-1.5">
                                <div className={`w-3 h-3 rounded-full ${status === 'Active' ? 'bg-green-500' : status === 'Inactive' ? 'bg-red-500' : 'bg-gray-500'}`}></div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="text-sm text-gray-500">
                                User ID: {userId}
                            </div>
                            <div className="text-sm text-gray-500">
                                Account created on: {formatDate(startDate)}
                            </div>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                            Full name
                        </label>
                        <input
                            id="fullname"
                            type="text"
                            value={fullname}
                            readOnly
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="flex items-center">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                readOnly
                                className="flex-1 px-3 py-2 border rounded-lg bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div className="flex items-center">
                            <span className="bg-gray-50 px-3 py-2 border rounded-l-lg border-r-0 text-gray-500">
                                <User className='w-6 h-6' />
                            </span>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                readOnly
                                className="flex-1 px-3 py-2 border rounded-r-lg bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Gender
                        </label>
                        <input
                            id="gender"
                            type="text"
                            value={gender || 'Not specified'}
                            readOnly
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* User Type */}
                    <div className="space-y-2">
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 flex flex-wrap gap-2">
                            {userType ? (
                                userType.split(", ").map((type, index) => (
                                    <div key={index} className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${type === 'Admin' ? 'bg-red-100 text-red-800' :
                                        type === 'Instructor' ? 'bg-green-100 text-green-800' :
                                            type === 'Student' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {type}
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-500">Not assigned</span>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <div className="w-full px-3 py-2 border rounded-lg bg-gray-50 flex flex-wrap gap-2">
                            <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${status === 'Active' ? 'bg-green-100 text-green-800' :
                                status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500' :
                                    status === 'Inactive' ? 'bg-red-500' :
                                        'bg-gray-500'
                                    }`}></div>
                                {status || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Specialization (Only for Instructors) */}
                    {isInstructor && (
                        <div className="space-y-2">
                            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                                Specialization
                            </label>
                            <div className="flex items-center">
                                <span className="bg-gray-50 px-3 py-2 border rounded-l-lg border-r-0 text-gray-500">
                                    <Briefcase className='w-6 h-6' />
                                </span>
                                <input
                                    id="specialization"
                                    type="text"
                                    value={specialization || 'Not specified'}
                                    readOnly
                                    className="flex-1 px-3 py-2 border rounded-r-lg bg-gray-50"
                                />
                            </div>
                        </div>
                    )}

                    {/* Years of Experience (Only for Instructors) */}
                    {isInstructor && (
                        <div className="space-y-2">
                            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                                Years of Experience
                            </label>
                            <div className="flex items-center">
                                <span className="bg-gray-50 px-3 py-2 border rounded-l-lg border-r-0 text-gray-500">
                                    <Clock className='w-6 h-6' />
                                </span>
                                <input
                                    id="yearsOfExperience"
                                    type="text"
                                    value={yearsOfExperience ? `${yearsOfExperience} years` : 'Not specified'}
                                    readOnly
                                    className="flex-1 px-3 py-2 border rounded-r-lg bg-gray-50"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;

