import { useEffect, useState } from 'react';
import { useNotification } from '../../../../components/Notification/NotificationContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL, BASE_URL_API } from '../../../../api/config';

const ClientLearningProfile = () => {
    const [user, setUser] = useState({ username: '', email: '', photo: '' });
    const [ownedCourses, setOwnedCourses] = useState([]);
    const { showNotification } = useNotification();

    useEffect(() => {
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
            fetchUserCourses(userData.userId);
        } else {
            showNotification('error', 'Lỗi tải dữ liệu', 'Không tìm thấy thông tin người dùng.');
        }
    }, [showNotification]);

    const fetchUserCourses = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL_API}/enrollments/student/${userId}/courses`);
            setOwnedCourses(response.data);
        } catch (error) {
            console.error('Error fetching user courses:', error);
            showNotification('error', 'Lỗi tải dữ liệu', 'Không thể tải thông tin khóa học.');
        }
    };

    const CourseCard = (course) => (
        <Link
            to={`/course/${course.courseId}/lessons`}
            state={{ course }}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
        >
            <img src={`${BASE_URL}${course.imageCourses}`} alt={course.title} className="w-full h-40 object-cover mb-4 rounded" />
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{course.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Tiến độ: {course.progress || 0}%</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                    {course.progress === 100 ? 'Xem lại' : 'Tiếp tục học'}
                </button>
            </div>
        </Link>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-blue-600">Hồ sơ học tập</h1>

            <div className="mb-8 border border-gray-200 rounded-lg p-4 flex items-center">
                <img src={user.photo ? `${BASE_URL}${user.photo}` : `/placeholder.svg`} alt="User Avatar" className="w-16 h-16 rounded-full mr-4" />
                <div>
                    <h2 className="text-xl font-semibold">{user.username}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Khóa học đang sở hữu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ownedCourses.map((course) => (
                        <CourseCard key={course.courseId} {...course} />
                    ))}
                </div>
                {ownedCourses.length === 0 && (
                    <p className="text-gray-600 text-center py-4">Bạn chưa sở hữu khóa học nào.</p>
                )}
            </div>
        </div>
    );
};

export default ClientLearningProfile;

