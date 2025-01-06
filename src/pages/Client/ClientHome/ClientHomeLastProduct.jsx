import axios from 'axios';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BASE_URL_API } from '../../../api/config'

const defaultCourses = [
    {
        courseId: 1,
        title: 'Khóa học Lập trình JavaScript cơ bản',
        description: 'Khóa học dành cho người mới bắt đầu với JavaScript.',
        price: 29.99,
        imageCourses: 'path_to_image1.jpg',
        category: { categoryId: 1 },
        rating: 4.5
    },
    {
        courseId: 2,
        title: 'Khóa học Thiết kế UX/UI',
        description: 'Khóa học giúp bạn hiểu về thiết kế trải nghiệm người dùng.',
        price: 39.99,
        imageCourses: 'path_to_image2.jpg',
        category: { categoryId: 2 },
        rating: 4.7
    },
    {
        courseId: 3,
        title: 'Khóa học Marketing kỹ thuật số',
        description: 'Khóa học giúp bạn nắm vững các kỹ thuật marketing online.',
        price: 49.99,
        imageCourses: 'path_to_image3.jpg',
        category: { categoryId: 3 },
        rating: 4.3
    },
    {
        courseId: 4,
        title: 'Khóa học Lập trình Python',
        description: 'Khóa học dành cho người mới bắt đầu với Python.',
        price: 34.99,
        imageCourses: 'path_to_image4.jpg',
        category: { categoryId: 1 },
        rating: 4.8
    },
    {
        courseId: 5,
        title: 'Khóa học Thiết kế đồ họa',
        description: 'Khóa học về thiết kế đồ họa và nghệ thuật số.',
        price: 44.99,
        imageCourses: 'path_to_image5.jpg',
        category: { categoryId: 2 },
        rating: 4.6
    },
    {
        courseId: 6,
        title: 'Khóa học AI cơ bản',
        description: 'Khóa học giới thiệu về trí tuệ nhân tạo.',
        price: 59.99,
        imageCourses: 'path_to_image6.jpg',
        category: { categoryId: 3 },
        rating: 4.9
    }
];

const defaultCategories = [
    { categoryId: 1, categoryName: 'Lập trình', description: 'Các khóa học về lập trình.' },
    { categoryId: 2, categoryName: 'Thiết kế', description: 'Khóa học về thiết kế đồ họa và UX/UI.' },
    { categoryId: 3, categoryName: 'Marketing', description: 'Khóa học về marketing kỹ thuật số.' }
];

const ClientHomeLastProduct = () => {
    const [courses, setCourses] = useState(defaultCourses);
    const [categories, setCategories] = useState(defaultCategories);
    const [currentlyLearning, setCurrentlyLearning] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, categoriesRes] = await Promise.all([
                    axios.get(`${BASE_URL_API}/courses`),
                    axios.get(`${BASE_URL_API}/categories`)
                ]);
                setCourses(coursesRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
            setIsLoggedIn(true);
            fetchCurrentlyLearning(JSON.parse(storedUserData).userId);
        }
    }, []);

    const fetchCurrentlyLearning = async (userId) => {
        try {
            const response = await axios.get(`${BASE_URL_API}/enrollments/student/${userId}/courses`);
            setCurrentlyLearning(response.data);
        } catch (error) {
            console.error('Error fetching currently learning courses:', error);
        }
    };

    const filteredCourses = courses.filter(course =>
        selectedCategory === null || course.category.categoryId === selectedCategory
    );

    const featuredCourses = [...courses]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

    const CourseCard = (course) => (
        <Link
            to={`/course/${course.courseId}`}
            state={{ course }}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <img src={course.imageCourses} alt={course.title} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                <div className="flex gap-2">
                    <p className="font-bold">${course.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <p className="text-sm font-medium text-yellow-500">{course.rating.toFixed(2)} </p>
                    </div>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="font-sans max-w-[1320px] mx-auto py-6">
            <h1 className="text-3xl font-bold mb-8">Khám phá khóa học CodemeIO</h1>

            {isLoggedIn && userData && ( // Kiểm tra trạng thái đăng nhập
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Khóa học bạn đang học</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentlyLearning.map(course => (
                            <div key={course.courseId} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                                <img src={course.imageCourses} alt={course.title} className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <p className="text-sm font-medium text-yellow-500">{course.rating.toFixed(2)} </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Khóa học nổi bật</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCourses.map(course => (
                        <CourseCard key={course.courseId} {...course} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Tất cả các khóa học</h2>
                <div className="flex flex-col sm:flex-row justify-between mb-6">
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300
                            ${selectedCategory === null ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                        >
                            Tất cả
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.categoryId}
                                onClick={() => setSelectedCategory(category.categoryId)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300
                                ${category.categoryId === selectedCategory ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                                {category.categoryName}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <CourseCard key={course.courseId} {...course} />
                        ))
                    ) : (
                        <p className="text-center">Không có khóa học nào trong danh mục này.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ClientHomeLastProduct;