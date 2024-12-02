import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';

const ClientCategory = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCategory, setNewCategory] = useState({ categoryName: '', description: '' });
    const [editingCategory, setEditingCategory] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                showNotification('error', 'Lỗi tải dữ liệu', 'Không tìm thấy thông tin danh mục.');
            }
        };

        fetchCategories();
    }, [showNotification]);

    // Tìm kiếm danh mục
    const handleSearch = async (term) => {
        try {
            const response = await axios.get(`${BASE_URL_API}/categories/search`, {
                params: { name: term }
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error searching categories:', error);
            showNotification('error', 'Lỗi tìm kiếm', 'Không thể tìm danh mục.');
        }
    };

    const filteredCategories = categories.filter(category =>
        category.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL_API}/categories`, newCategory);
            setCategories([...categories, response.data]);
            setNewCategory({ categoryName: '', description: '' });
            setShowAddForm(false);
            showNotification('success', 'Thành công', 'Danh mục đã được thêm.');
        } catch (error) {
            console.error('Error adding category:', error);
            showNotification('error', 'Lỗi thêm danh mục', 'Không thể thêm danh mục mới.');
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${BASE_URL_API}/categories/${editingCategory.categoryId}`, editingCategory);
            setCategories(categories.map(c => c.categoryId === editingCategory.categoryId ? response.data : c));
            setEditingCategory(null);
            showNotification('success', 'Thành công', 'Danh mục đã được cập nhật.');
        } catch (error) {
            console.error('Error updating category:', error);
            showNotification('error', 'Lỗi cập nhật danh mục', 'Không thể cập nhật danh mục.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await axios.get(`${BASE_URL_API}/categories/${categoryId}/courses`);
            const relatedCourses = response.data;

            if (relatedCourses.length > 0) {
                const confirmDelete = window.confirm("Danh mục này có các khóa học liên quan. Bạn có chắc chắn muốn xóa không?");
                if (!confirmDelete) return;
            }

            for (const course of relatedCourses) {
                await axios.delete(`${BASE_URL_API}/courses/${course.courseId}`);
            }

            await axios.delete(`${BASE_URL_API}/categories/${categoryId}`);
            setCategories(categories.filter(c => c.categoryId !== categoryId));
            showNotification('success', 'Thành công', 'Danh mục đã được xóa.');
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification('error', 'Lỗi xóa danh mục', 'Không thể xóa danh mục.');
        }
    };

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>

            <div className="flex justify-between items-center mb-4">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            handleSearch(e.target.value); // Gọi hàm tìm kiếm khi người dùng gõ
                        }}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Category
                </button>
            </div>

            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New Category</h3>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Category Name"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newCategory.categoryName}
                                onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            />
                            <div className="flex justify-end space-x-2">
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {filteredCategories.map(category => (
                    <div key={category.categoryId} className="border p-4 rounded-lg hover:shadow-custom-1">
                        {editingCategory && editingCategory.categoryId === category.categoryId ? (
                            <form onSubmit={handleUpdateCategory} className="space-y-2">
                                <input
                                    type="text"
                                    value={editingCategory.categoryName}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, categoryName: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    required
                                />
                                <input
                                    type="text"
                                    value={editingCategory.description}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <div className="flex justify-end space-x-2">
                                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setEditingCategory(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <h3 className="text-lg font-semibold">{category.categoryName}</h3>
                                <p className="text-gray-600">{category.description}</p>
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={() => handleEditCategory(category)} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDeleteCategory(category.categoryId)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClientCategory;