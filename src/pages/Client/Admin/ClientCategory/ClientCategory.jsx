import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';

const ClientCategory = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCategory, setCurrentCategory] = useState({ categoryName: '', description: '' });
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add'); // 'add' hoặc 'edit'
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

    const handleSearch = async (term) => {
        try {
            const response = await axios.get(`${BASE_URL_API}/categories/search`, {
                params: { name: term },
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (formAction === 'add') {
                response = await axios.post(`${BASE_URL_API}/categories`, currentCategory);
                setCategories([...categories, response.data]);
                showNotification('success', 'Thành công', 'Danh mục đã được thêm.');
            } else if (formAction === 'edit') {
                response = await axios.put(`${BASE_URL_API}/categories/${currentCategory.categoryId}`, currentCategory);
                setCategories(categories.map(cat => cat.categoryId === currentCategory.categoryId ? response.data : cat));
                showNotification('success', 'Thành công', 'Danh mục đã được cập nhật.');
            }
            setCurrentCategory({ categoryName: '', description: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Lỗi', 'Không thể thực hiện thao tác.');
        }
    };

    const handleEditCategory = (category) => {
        setCurrentCategory({ categoryName: category.categoryName, description: category.description, categoryId: category.categoryId });
        setFormAction('edit');
        setShowForm(true);
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
                            handleSearch(e.target.value);
                        }}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setFormAction('add');
                        setCurrentCategory({ categoryName: '', description: '' });
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Category
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{formAction === 'add' ? 'Add New Category' : 'Edit Category'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Category Name"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={currentCategory.categoryName}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, categoryName: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                className="w-full px-4 py-2 border rounded-lg"
                                value={currentCategory.description}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                            />
                            <div className="flex justify-end space-x-2">
                                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    {formAction === 'add' ? 'Add' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ClientCategory;