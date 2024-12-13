import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, MoreVertical, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import Pagination from '../../../../components/Pagination/Pagination';
import Count from '../../../../components/Count/Count';
import InputSearch from '../../../../components/Search/Search';
import TableHeader from '../../../../components/Table/TableHeader';
import CategoryForm from '../../../../components/Form/CategoryForm';

const ClientCategory = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCategory, setCurrentCategory] = useState({
        categoryId: '',
        categoryName: '',
        description: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add');
    const { showNotification } = useNotification();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 8;
    const headers = ['Category Name', 'Description', ''];

    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/categories`);
                setCategories(response.data);
                setFilteredCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                showNotification('error', 'Error loading data', 'Unable to fetch category information.');
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term) {
            setFilteredCategories(categories);
            setCurrentPage(1);
            return;
        }

        const filtered = categories.filter(category =>
            category.categoryName.toLowerCase().includes(term.toLowerCase()) ||
            category.description.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCategories(filtered);
        setCurrentPage(1);
    };

    const handleSubmit = async (categoryData) => {
        try {
            let response;
            if (formAction === 'add') {
                response = await axios.post(`${BASE_URL_API}/categories`, categoryData);
                setCategories([...categories, response.data]);
                setFilteredCategories([...filteredCategories, response.data]);
                showNotification('success', 'Success', 'Category has been added.');
            } else if (formAction === 'edit') {
                response = await axios.put(`${BASE_URL_API}/categories/${categoryData.categoryId}`, categoryData);
                setCategories(categories.map(category => (category.categoryId === categoryData.categoryId ? response.data : category)));
                setFilteredCategories(filteredCategories.map(category => (category.categoryId === categoryData.categoryId ? response.data : category)));
                showNotification('success', 'Success', 'Category has been updated.');
            }
            setCurrentCategory({ categoryId: '', categoryName: '', description: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Error', 'Unable to perform the operation.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await axios.get(`${BASE_URL_API}/categories/${categoryId}/courses`);
            const relatedCourses = response.data;

            if (relatedCourses.length > 0) {
                const confirmDelete = window.confirm("This category has related courses. Are you sure you want to delete it?");
                if (!confirmDelete) return;
            }

            for (const course of relatedCourses) {
                await axios.delete(`${BASE_URL_API}/courses/${course.courseId}`);
            }

            await axios.delete(`${BASE_URL_API}/categories/${categoryId}`);
            setCategories(categories.filter(c => c.categoryId !== categoryId));
            setFilteredCategories(filteredCategories.filter(c => c.categoryId !== categoryId));
            showNotification('success', 'Success', 'Category has been deleted.');
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification('error', 'Error deleting category', 'Unable to delete the category.');
        }
    };

    const handleMoreOptions = (category) => {
        return [
            {
                label: 'Edit category',
                action: () => {
                    setCurrentCategory(category);
                    setShowForm(true);
                    setFormAction('edit');
                },
                icon: <Edit className="h-4 w-4 mr-2" />
            },
            { label: 'Delete category', action: () => handleDeleteCategory(category.categoryId), icon: <Trash className="h-4 w-4 mr-2" /> },
        ];
    };

    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
    const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

    const handleClickOutside = useCallback((event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActiveDropdown(null);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    useEffect(() => {
        const handleScroll = () => {
            setActiveDropdown(null);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleMoreVerticalClick = (event, categoryId) => {
        event.stopPropagation();
        const rect = event.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 100;

        setDropdownPosition({
            top: spaceBelow > dropdownHeight || spaceBelow > spaceAbove
                ? rect.bottom + window.scrollY
                : rect.top - dropdownHeight + window.scrollY,
            left: rect.right - 192 + window.scrollX
        });
        setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
    };

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>

            <div className="flex justify-between items-center mb-4">
                <Count count={filteredCategories.length} title="Total Categories" />
                <div className="flex items-center">
                    <InputSearch
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        placeholder="Search categories..."
                    />
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setFormAction('add');
                            setCurrentCategory({ categoryId: '', categoryName: '', description: '' });
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Category
                    </button>
                </div>
            </div>

            {showForm && (
                <CategoryForm
                    category={currentCategory}
                    onClose={() => setShowForm(false)}
                    onSave={handleSubmit}
                    formAction={formAction}
                />
            )}

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <TableHeader headers={headers} />
                    <tbody>
                        {currentCategories.map(category => (
                            <tr key={category.categoryId} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">
                                    <div className="font-semibold">{category.categoryName}</div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div>{category.description}</div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={(e) => handleMoreVerticalClick(e, category.categoryId)}
                                            className="p-1 hover:bg-gray-200 rounded-full"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {activeDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                    }}
                >
                    <div className="py-1">
                        {handleMoreOptions(categories.find(category => category.categoryId === activeDropdown)).map((option) => (
                            <button
                                key={`${activeDropdown}-${option.label}`}
                                onClick={() => {
                                    option.action();
                                    setActiveDropdown(null);
                                }}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}

export default ClientCategory;