import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const RoleForm = ({ role, onClose, onSave, formAction }) => {
    const [roleName, setRoleName] = useState('');

    useEffect(() => {
        if (role && formAction === 'edit') {
            // eslint-disable-next-line react/prop-types
            setRoleName(role.roleName);
        }
    }, [role, formAction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formAction === 'add') {
            onSave({ roleName });
        } else {
            onSave({ ...role, roleName });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        {formAction === 'add' ? 'Add New Role' : 'Edit Role'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close form"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
                                Role Name
                            </label>
                            <input
                                id="roleName"
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter role name"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            {formAction === 'add' ? 'Add Role' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoleForm;