import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, MoreVertical, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import Pagination from '../../../../components/Pagination/Pagination';
import Count from '../../../../components/Count/Count';
import InputSearch from '../../../../components/Search/Search';
import TableHeader from '../../../../components/Table/TableHeader';
import CourseForm from '../../../../components/Form/CourseForm';

const ClientCourses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentCourse, setCurrentCourse] = useState({
        courseId: '',
        title: '',
        description: '',
        price: 0,
        rating: 0,
        ImageCourses: '',
        totalStudents: 0,
        instructor: {}, // Đảm bảo instructor là đối tượng
    });
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add');
    const { showNotification } = useNotification();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [instructorUser, setInstructorUser] = useState({ userId: 0, fullname: `` });
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 8;
    const headers = ['Course', 'Description', 'Price', 'Rating', 'Total Students', ''];
    const dropdownRef = useRef(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const fetchUserInfo = async () => {
                try {
                    const response = await axios.get(`${BASE_URL_API}/users/${user.userId}`);
                    setInstructorUser(response.data);
                } catch (error) {
                    console.error('Error fetching user information:', error);
                    showNotification('error', 'Error loading data', 'Unable to fetch user information.');
                }
            };
            fetchUserInfo();
        }

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/courses`);
                setCourses(response.data);
                setFilteredCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
                showNotification('error', 'Error loading data', 'Unable to fetch course information.');
            }
        };
        fetchCourses();
    }, [showNotification]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (!term) {
            setFilteredCourses(courses);
            setCurrentPage(1);
            return;
        }

        const filtered = courses.filter(course =>
            course.title.toLowerCase().includes(term.toLowerCase()) ||
            course.description.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCourses(filtered);
        setCurrentPage(1);
    };

    const handleAddCourse = () => {
        setCurrentCourse({
            courseId: '',
            title: '',
            description: '',
            price: 0,
            rating: 0,
            ImageCourses: '',
            totalStudents: 0,
            instructor: instructorUser
        });
        setShowForm(true);
        setFormAction('add');
    };

    const handleSubmit = async (courseData, imageFile) => {
        try {
            let response;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            // Đảm bảo instructorId và categoryId được bao gồm
            courseData.instructorId = courseData.instructor.userId; // id của giảng viên
            courseData.categoryId = courseData.category ? courseData.category.categoryId : null; // id của danh mục

            const updatedCourseData = {
                ...courseData,
                price: parseFloat(courseData.price) || 0,
            };

            if (formAction === 'add') {
                // Tạo khóa học mà không cần hình ảnh trước
                response = await axios.post(`${BASE_URL_API}/courses`, updatedCourseData, config);
                const newCourseId = response.data.courseId;

                // Nếu có hình ảnh, tải lên nó bây giờ
                if (imageFile) {
                    const formData = new FormData();
                    formData.append('file', imageFile); // Đảm bảo tên tệp là 'file'

                    // Gọi endpoint upload-image để lưu hình ảnh
                    await axios.post(`${BASE_URL_API}/courses/${newCourseId}/upload-image`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                }

                setCourses([...courses, response.data]);
                setFilteredCourses([...filteredCourses, response.data]);
                showNotification('success', 'Success', 'Course has been added.');
            } else if (formAction === 'edit') {
                if (imageFile) {
                    const formData = new FormData();
                    formData.append('file', imageFile); // Đảm bảo tên tệp là 'file'

                    // Gọi endpoint upload-image để cập nhật hình ảnh
                    await axios.post(`${BASE_URL_API}/courses/${courseData.courseId}/upload-image`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                }

                // Cập nhật khóa học
                response = await axios.put(`${BASE_URL_API}/courses/${updatedCourseData.courseId}`, updatedCourseData, config);
                setCourses(courses.map(course => (course.courseId === response.data.courseId ? response.data : course)));
                setFilteredCourses(filteredCourses.map(course => (course.courseId === response.data.courseId ? response.data : course)));
                showNotification('success', 'Success', 'Course has been updated.');
            }

            setCurrentCourse({ courseId: '', title: '', description: '', price: 0, rating: 0, ImageCourses: null, totalStudents: 0 });
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Error', 'Unable to perform the operation: ' + error.message);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            await axios.delete(`${BASE_URL_API}/courses/${courseId}`);
            setCourses(courses.filter(c => c.courseId !== courseId));
            setFilteredCourses(filteredCourses.filter(c => c.courseId !== courseId));
            showNotification('success', 'Success', 'Course has been deleted.');
        } catch (error) {
            console.error('Error deleting course:', error);
            showNotification('error', 'Error deleting course', 'Unable to delete the course.');
        }
    };

    const handleMoreOptions = (course) => {
        return [
            {
                label: 'Edit course',
                action: () => {
                    setCurrentCourse({
                        ...course,
                        instructor: course.instructor || {},
                        category: course.category ? { ...course.category, categoryId: course.category.categoryId } : null
                    });
                    setShowForm(true);
                    setFormAction('edit');
                },
                icon: <Edit className="h-4 w-4 mr-2" />
            },
            { label: 'Delete course', action: () => handleDeleteCourse(course.courseId), icon: <Trash className="h-4 w-4 mr-2" /> },
        ];
    };

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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

    const handleMoreVerticalClick = (event, courseId) => {
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
        setActiveDropdown(activeDropdown === courseId ? null : courseId);
    };

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Courses</h2>

            <div className="flex justify-between items-center mb-4">
                <Count count={filteredCourses.length} title="Total Courses" />
                <div className="flex items-center">
                    <InputSearch
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        placeholder="Search courses..."
                    />
                    <button
                        onClick={handleAddCourse}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Course
                    </button>
                </div>
            </div>

            {showForm && (
                <CourseForm
                    course={currentCourse}
                    onClose={() => setShowForm(false)}
                    onSave={handleSubmit}
                    formAction={formAction}
                />
            )}

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <TableHeader headers={headers} />
                    <tbody>
                        {currentCourses.map(course => (
                            <tr key={course.courseId} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">
                                    <div className="flex items-center">
                                        <img
                                            src={course.ImageCourses}
                                            alt={course.title}
                                            className="w-10 h-10 object-cover rounded-full mr-3"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/placeholder.svg?height=40&width=40';
                                            }}
                                        />
                                        <div className="font-semibold">{course.title}</div>
                                    </div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="truncate max-w-xs">{course.description}</div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div>${course.price.toFixed(2)}</div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div>{course.rating.toFixed(1)}</div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div>{course.totalStudents}</div>
                                </td>
                                <td className="py-2 px-4 border-b">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={(e) => handleMoreVerticalClick(e, course.courseId)}
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
                        {handleMoreOptions(courses.find(course => course.courseId === activeDropdown)).map((option) => (
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

export default ClientCourses;