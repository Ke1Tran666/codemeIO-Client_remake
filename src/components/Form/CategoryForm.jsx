/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const CategoryForm = ({ category, onClose, onSave, formAction }) => {
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (category && formAction === 'edit') {
            setCategoryName(category.categoryName);
            setDescription(category.description);
        }
    }, [category, formAction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formAction === 'add') {
            onSave({ categoryName, description });
        } else {
            onSave({ ...category, categoryName, description });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        {formAction === 'add' ? 'Add New Category' : 'Edit Category'}
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
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                                Category Name
                            </label>
                            <input
                                id="categoryName"
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter category name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter category description"
                                rows={3}
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
                            {formAction === 'add' ? 'Add Category' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;