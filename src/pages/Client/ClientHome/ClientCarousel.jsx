'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { BASE_URL_API } from '../../../api/config'

const ClientCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [courses, setCourses] = useState([])

    const defaultSlides = [
        {
            title: "Get your first job as a UI/UX designer",
            description: "Learn UI/UX design and create a stunning portfolio",
            imageCourses: "https://plus.unsplash.com/premium_photo-1661589354357-f56ddf86a0b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$11.99",
            rating: 4.5
        },
        {
            title: "The Complete 2023 Web Development Bootcamp",
            description: "Become a full-stack web developer with just one course",
            imageCourses: "https://plus.unsplash.com/premium_photo-1675793715030-0584c8ec4a13?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$13.99",
            rating: 4.4
        },
        {
            title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
            description: "Learn to create Machine Learning Algorithms in Python and R",
            imageCourses: "https://img-b.udemycdn.com/course/750x422/950390_270f_3.jpg",
            price: "$12.99",
            rating: 4.9
        }
    ]

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${BASE_URL_API}/courses`);
                const latestCourses = response.data
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sắp xếp theo thời gian tạo
                    .slice(-5); // Lấy 5 phần tử đầu tiên
                setCourses(latestCourses);
            } catch (error) {
                console.error('Lỗi gọi API:', error);
                setCourses(defaultSlides);
            }
        };
        fetchCourses();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % courses.length);
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + courses.length) % courses.length);
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [courses.length]);

    if (courses.length === 0) {
        return (
            <div className="flex justify-center items-center h-[400px] text-2xl font-semibold">
                Loading...
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-[1320px] mx-auto overflow-hidden px-4 rounded-lg">
            <div className="relative h-[400px]">
                {courses.map((course, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <img src={course.imageCourses} alt={course.title} className="object-cover w-full h-full rounded-lg" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-6 rounded-b-lg">
                            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                            <p className="mb-2">{course.description}</p>
                            <div className="flex items-center">
                                <span className="text-xl font-bold mr-2">{course.price}</span>
                                <div className="flex items-center text-yellow-400">
                                    <span className="text-xl font-bold mr-1">{course.rating}</span>
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
                aria-label="Previous Slide"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
                aria-label="Next Slide"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>
        </div>
    )
}

export default ClientCarousel;