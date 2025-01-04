import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, MoreVertical, Edit, Trash, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { BASE_URL_API } from '../../../../api/config';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import Pagination from '../../../../components/Pagination/Pagination';
import Count from '../../../../components/Count/Count';
import InputSearch from '../../../../components/Search/Search';
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
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/courses`);
                const coursesWithLessonCount = await Promise.all(response.data.map(async (course) => {
                    const lessonResponse = await axios.get(`${BASE_URL_API}/lessons/course/${course.courseId}`);
                    return { ...course, lessonCount: lessonResponse.data.length };
                }));
                setCourses(coursesWithLessonCount);
                setFilteredCourses(coursesWithLessonCount);
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
        setCurrentLesson({ courseId: parseInt(courseId, 10) });
        setFormAction('add');
        setShowForm(true);
    };

    const handleEditLesson = (lesson) => {
        setCurrentLesson({
            ...lesson,
            courseId: parseInt(lesson.courseId, 10)
        });
        setFormAction('edit');
        setShowForm(true);
    };

    const handleSubmitLesson = async (lessonData) => {
        // console.log('Received lesson data:', lessonData);

        try {
            let response;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const courseId = parseInt(lessonData.courseId, 10);
            const course = courses.find(c => c.courseId === courseId);

            if (!course) {
                throw new Error('Course not found');
            }

            const updatedLessonData = {
                ...lessonData,
                course: course
            };

            if (formAction === 'add') {
                response = await axios.post(`${BASE_URL_API}/lessons`, updatedLessonData, config);
                setCourseLessons(prev => ({
                    ...prev,
                    [lessonData.courseId]: [...(prev[lessonData.courseId] || []), response.data]
                }));
                setCourses(prevCourses => prevCourses.map(course =>
                    course.courseId === lessonData.courseId
                        ? { ...course, lessonCount: (course.lessonCount || 0) + 1 }
                        : course
                ));
                setFilteredCourses(prevCourses => prevCourses.map(course =>
                    course.courseId === lessonData.courseId
                        ? { ...course, lessonCount: (course.lessonCount || 0) + 1 }
                        : course
                ));
                showNotification('success', 'Success', 'Lesson has been added.');
            } else if (formAction === 'edit') {
                response = await axios.put(`${BASE_URL_API}/lessons/${lessonData.lessonId}`, updatedLessonData, config);
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

            setCourseLessons(prevLessons => {
                const updatedLessons = { ...prevLessons };
                const courseIds = Object.keys(updatedLessons);

                for (let id of courseIds) {
                    updatedLessons[id] = updatedLessons[id].filter(
                        lesson => lesson.lessonId !== lessonId
                    );
                    if (updatedLessons[id].length === 0) {
                        delete updatedLessons[id];
                    }
                }

                // console.log('Updated courseLessons:', updatedLessons);
                return updatedLessons;
            });

            setCourses(prevCourses => prevCourses.map(course =>
                course.courseId === courseId
                    ? { ...course, lessonCount: Math.max((course.lessonCount || 1) - 1, 0) }
                    : course
            ));

            setFilteredCourses(prevCourses => prevCourses.map(course =>
                course.courseId === courseId
                    ? { ...course, lessonCount: Math.max((course.lessonCount || 1) - 1, 0) }
                    : course
            ));

            showNotification('success', 'Success', 'Lesson has been deleted.');
        } catch (error) {
            console.error('Error deleting lesson:', error);
            showNotification('error', 'Error', 'Unable to delete the lesson. Please try again later.');
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
            <h2 className="text-2xl font-bold mb-4">Lessons</h2>

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
                    courses={courses}
                />
            )}

            <div className="overflow-x-auto relative">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-500">Total Lessons</th>
                            <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentCourses.map(course => (
                            <React.Fragment key={course.courseId}>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => {
                                                    console.log('Course ID:', course.courseId);
                                                    toggleCourseExpansion(course.courseId)
                                                }}
                                                className={`mr-2 transform transition-transform ${expandedCourse === course.courseId ? 'rotate-90' : ''
                                                    }`}
                                            >
                                                <ChevronRight className="h-5 w-5 text-gray-400" />
                                            </button>
                                            <span className="font-medium text-gray-900">{course.title}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-500">
                                        {course.lessonCount} lessons
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleAddLesson(course.courseId)}
                                                className="p-1 text-gray-400 hover:text-gray-600"
                                                title="Add Lesson"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedCourse === course.courseId && (
                                    <tr>
                                        <td colSpan="4" className="py-2 px-4 bg-gray-50">
                                            {loadingLessons === course.courseId ? (
                                                <div className="text-center py-4">Loading lessons...</div>
                                            ) : courseLessons[course.courseId] ? (
                                                <div className="ml-8">
                                                    <table className="w-full">
                                                        <tbody className="divide-y divide-gray-200">
                                                            {courseLessons[course.courseId].map(lesson => (
                                                                <tr key={lesson.lessonId} className="hover:bg-gray-100">
                                                                    <td className="py-3 px-4 text-sm text-gray-900">
                                                                        {lesson.title}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-sm text-gray-500">
                                                                        {lesson.description}
                                                                    </td>
                                                                    <td className="py-3 px-4 text-sm text-gray-500">
                                                                        {lesson.linkVideo || 'N/A'}
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        <div className="flex justify-end">
                                                                            <button
                                                                                onClick={(e) => handleMoreVerticalClick(e, lesson.lessonId)}
                                                                                className="p-1 text-gray-400 hover:text-gray-600"
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
                                            ) : (
                                                <div className="text-center py-4 text-gray-500">
                                                    No lessons found for this course.
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {activeDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute bg-white rounded-lg shadow-lg z-10 border border-gray-200"
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
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                {option.icon}
                                <span>{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}

export default ClientLessons;