import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, MoreVertical, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import Pagination from '../../../../components/Pagination/Pagination';
import Count from '../../../../components/Count/Count';
import InputSearch from '../../../../components/Search/Search';
import TableHeader from '../../../../components/Table/TableHeader';
import LessonForm from '../../../../components/Form/LessonForm';

const ClientLessons = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentLesson, setCurrentLesson] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formAction, setFormAction] = useState('add');
    const { showNotification } = useNotification();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [courseLessons, setCourseLessons] = useState({});
    const [loadingLessons, setLoadingLessons] = useState(null);
    const coursesPerPage = 8;
    const courseHeaders = ['Course', 'Lessons', ''];
    const lessonHeaders = ['Lesson Title', 'Description', ''];
    const dropdownRef = useRef(null);

    useEffect(() => {
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
            course.title.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCourses(filtered);
        setCurrentPage(1);
    };

    const handleAddLesson = (courseId) => {
        setCurrentLesson({ courseId });
        setShowForm(true);
        setFormAction('add');
    };

    const handleEditLesson = (lesson) => {
        setCurrentLesson(lesson);
        setShowForm(true);
        setFormAction('edit');
    };

    const handleSubmitLesson = async (lessonData) => {
        try {
            let response;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (formAction === 'add') {
                response = await axios.post(`${BASE_URL_API}/lessons`, lessonData, config);
                setCourseLessons(prev => ({
                    ...prev,
                    [lessonData.courseId]: [...(prev[lessonData.courseId] || []), response.data]
                }));
                showNotification('success', 'Success', 'Lesson has been added.');
            } else if (formAction === 'edit') {
                response = await axios.put(`${BASE_URL_API}/lessons/${lessonData.lessonId}`, lessonData, config);
                setCourseLessons(prev => ({
                    ...prev,
                    [lessonData.courseId]: prev[lessonData.courseId].map(lesson =>
                        lesson.lessonId === response.data.lessonId ? response.data : lesson
                    )
                }));
                showNotification('success', 'Success', 'Lesson has been updated.');
            }

            setCurrentLesson(null);
            setShowForm(false);
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', 'Error', 'Unable to perform the operation: ' + error.message);
        }
    };

    const handleDeleteLesson = async (lessonId, courseId) => {
        try {
            await axios.delete(`${BASE_URL_API}/lessons/${lessonId}`);
            setCourseLessons(prev => ({
                ...prev,
                [courseId]: prev[courseId].filter(lesson => lesson.lessonId !== lessonId)
            }));
            showNotification('success', 'Success', 'Lesson has been deleted.');
        } catch (error) {
            console.error('Error deleting lesson:', error);
            showNotification('error', 'Error deleting lesson', 'Unable to delete the lesson.');
        }
    };

    const handleMoreOptions = (lesson) => {
        return [
            {
                label: 'Edit lesson',
                action: () => handleEditLesson(lesson),
                icon: <Edit className="h-4 w-4 mr-2" />
            },
            {
                label: 'Delete lesson',
                action: () => handleDeleteLesson(lesson.lessonId, lesson.courseId),
                icon: <Trash className="h-4 w-4 mr-2" />
            },
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

    const handleMoreVerticalClick = (event, lessonId) => {
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
        setActiveDropdown(activeDropdown === lessonId ? null : lessonId);
    };

    const fetchLessonsForCourse = async (courseId) => {
        setLoadingLessons(courseId);
        try {
            const response = await axios.get(`${BASE_URL_API}/lessons/course/${courseId}`);
            setCourseLessons(prev => ({ ...prev, [courseId]: response.data }));
        } catch (error) {
            console.error('Error fetching lessons:', error);
            showNotification('error', 'Error loading lessons', 'Unable to fetch lesson information.');
        } finally {
            setLoadingLessons(null);
        }
    };

    const toggleCourseExpansion = (courseId) => {
        if (expandedCourse === courseId) {
            setExpandedCourse(null);
        } else {
            setExpandedCourse(courseId);
            if (!courseLessons[courseId]) {
                fetchLessonsForCourse(courseId);
            }
        }
    };

    return (
        <div className="p-6 overflow-x-hidden">
            <h2 className="text-2xl font-bold mb-4">Courses and Lessons</h2>

            <div className="flex justify-between items-center mb-4">
                <Count count={filteredCourses.length} title="Total Courses" />
                <div className="flex items-center">
                    <InputSearch
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                        placeholder="Search courses..."
                    />
                </div>
            </div>

            {showForm && (
                <LessonForm
                    lesson={currentLesson}
                    onClose={() => setShowForm(false)}
                    onSave={handleSubmitLesson}
                    formAction={formAction}
                />
            )}

            <div className="overflow-x-auto relative">
                <table className="w-full">
                    <TableHeader headers={courseHeaders} />
                    <tbody>
                        {currentCourses.map(course => (
                            <>
                                <tr key={course.courseId} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex items-center">
                                            <div className="font-semibold">{course.title}</div>
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => toggleCourseExpansion(course.courseId)}
                                            className="flex items-center text-blue-500 hover:text-blue-700"
                                        >
                                            {expandedCourse === course.courseId ? (
                                                <>
                                                    <ChevronUp className="h-4 w-4 mr-1" />
                                                    Hide Lessons
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="h-4 w-4 mr-1" />
                                                    Show Lessons
                                                </>
                                            )}
                                        </button>
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleAddLesson(course.courseId)}
                                                className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
                                                title="Add Lesson"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedCourse === course.courseId && (
                                    <tr>
                                        <td colSpan="3" className="py-2 px-4 border-b">
                                            {loadingLessons === course.courseId ? (
                                                <div className="text-center py-4">Loading lessons...</div>
                                            ) : courseLessons[course.courseId] ? (
                                                <table className="w-full">
                                                    <TableHeader headers={lessonHeaders} />
                                                    <tbody>
                                                        {courseLessons[course.courseId].map(lesson => (
                                                            <tr key={lesson.lessonId} className="hover:bg-gray-100">
                                                                <td className="py-2 px-4">{lesson.title}</td>
                                                                <td className="py-2 px-4">{lesson.description}</td>
                                                                <td className="py-2 px-4">
                                                                    <div className="flex justify-end">
                                                                        <button
                                                                            onClick={(e) => handleMoreVerticalClick(e, lesson.lessonId)}
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
                                            ) : (
                                                <div className="text-center py-4">No lessons found for this course.</div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </>
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
                        {handleMoreOptions(courseLessons[expandedCourse].find(lesson => lesson.lessonId === activeDropdown)).map((option) => (
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

export default ClientLessons;