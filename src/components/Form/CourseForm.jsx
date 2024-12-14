import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNotification } from '../../components/Notification/NotificationContext';
import axios from 'axios';
import { BASE_URL_API } from '../../api/config';

const CourseForm = ({ course, onClose, onSave, formAction, instructor }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [imageCourses, setImageCourses] = useState('');
    const [totalStudents, setTotalStudents] = useState('');
    const [instructorName, setInstructorName] = useState(''); // Thay đổi thành instructorName
    const [category, setCategory] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [categoryInputWidth, setCategoryInputWidth] = useState(0);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const categoryInputRef = useRef(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (course && formAction === 'edit') {
            setTitle(course.title);
            setDescription(course.description);
            setPrice(course.price.toString());
            setRating(course.rating.toString());
            setImageCourses(course.imageCourses || '');
            setTotalStudents(course.totalStudents?.toString() || '0');
            setInstructorName(instructor || course.instructor || ''); // Nhận tên người dùng từ prop
            setCategory(course.category || null);
        } else {
            setInstructorName(instructor || ''); // Nhận tên người dùng khi thêm mới khóa học
        }
    }, [course, formAction, instructor]); // Thêm instructor vào dependencies

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BASE_URL_API}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                showNotification('error', 'Error loading data', 'Unable to fetch category information.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, [showNotification]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = new FormData();
        courseData.append('title', title);
        courseData.append('description', description);
        courseData.append('price', parseFloat(price));
        courseData.append('rating', parseFloat(rating));
        courseData.append('totalStudents', parseInt(totalStudents, 10));
        courseData.append('instructor', instructorName); // Sử dụng instructorName
        courseData.append('categoryId', category ? category.categoryId : '');

        if (imageFile) {
            courseData.append('imageCourses', imageFile);
        } else if (imageCourses) {
            courseData.append('imageCourses', imageCourses);
        }

        if (formAction === 'edit') {
            courseData.append('courseId', course.courseId);
        }

        try {
            const response = await axios.post(`${BASE_URL_API}/courses`, courseData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showNotification('success', 'Success', `Course ${formAction === 'add' ? 'added' : 'updated'} successfully.`);
            onSave(response.data);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('error', 'Error', `Failed to ${formAction} course. Please try again.`);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageCourses(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImageCourses('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        {formAction === 'add' ? 'Add New Course' : 'Edit Course'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        aria-label="Close form"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter course title"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label htmlFor="totalStudents" className="block text-sm font-medium text-gray-700">
                                    Total Students
                                </label>
                                <input
                                    id="totalStudents"
                                    type="number"
                                    min="0"
                                    value={totalStudents}
                                    onChange={(e) => setTotalStudents(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter total number of students"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                    Rating
                                </label>
                                <input
                                    id="rating"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter course rating (0-5)"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter course price"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter course description"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="ImageCourses" className="block text-sm font-medium text-gray-700">
                                Course Image
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="ImageCourses"
                                    type="text"
                                    value={imageCourses}
                                    onChange={(e) => setImageCourses(e.target.value)}
                                    className="flex-grow px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter image URL or upload a file"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Upload
                                </button>
                            </div>
                            {(imageCourses || imageFile) && (
                                <div className="mt-2 flex items-center">
                                    <img
                                        src={imageCourses}
                                        alt="Course preview"
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="ml-2 text-red-600 hover:text-red-800"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                                Instructor
                            </label>
                            <input
                                id="instructor"
                                type="text"
                                value={instructorName}
                                onChange={(e) => setInstructorName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter instructor name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <div
                                ref={categoryInputRef}
                                className="w-full min-h-[38px] px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer bg-white flex items-center justify-between"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setDropdownPosition({
                                        top: rect.bottom + window.scrollY,
                                        left: rect.left + window.scrollX,
                                    });
                                    setCategoryInputWidth(rect.width);
                                    setIsCategoryOpen(!isCategoryOpen);
                                }}
                            >
                                <span className={category ? "text-gray-900" : "text-gray-400"}>
                                    {category ? category.categoryName : "Select category"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </div>

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
                            {formAction === 'add' ? 'Add Course' : 'Save Changes'}
                        </button>
                    </div>
                </form>
                {isCategoryOpen && (
                    <div
                        className="fixed z-50 bg-white border rounded-lg shadow-lg overflow-hidden"
                        style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            width: `${categoryInputWidth}px`,
                        }}
                    >
                        <div className="py-1 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {isLoading ? (
                                <div className="text-center py-2">Loading categories...</div>
                            ) : categories.length > 0 ? (
                                categories.map((cat) => (
                                    <button
                                        key={cat.categoryId}
                                        type="button"
                                        onClick={() => {
                                            setCategory(cat);
                                            setIsCategoryOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                    >
                                        {cat.categoryName}
                                    </button>
                                ))
                            ) : (
                                <div className="text-center py-2">No categories available</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

CourseForm.propTypes = {
    course: PropTypes.shape({
        courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.number,
        rating: PropTypes.number,
        imageCourses: PropTypes.string,
        totalStudents: PropTypes.number,
        instructor: PropTypes.string,
        category: PropTypes.shape({
            categoryId: PropTypes.string,
            categoryName: PropTypes.string,
            description: PropTypes.string
        })
    }),
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    formAction: PropTypes.oneOf(['add', 'edit']).isRequired,
    instructor: PropTypes.string // Thêm propTypes cho instructor
};

export default CourseForm;