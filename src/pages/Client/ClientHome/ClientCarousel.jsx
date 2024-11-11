'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ClientCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [courses, setCourses] = useState([])

    const defaultSlides = [
        {
            title: "Get your first job as a UI/UX designer",
            description: "Learn UI/UX design and create a stunning portfolio",
            image: "https://plus.unsplash.com/premium_photo-1661589354357-f56ddf86a0b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$11.99",
            originalPrice: "$84.99"
        },
        {
            title: "The Complete 2023 Web Development Bootcamp",
            description: "Become a full-stack web developer with just one course",
            image: "https://plus.unsplash.com/premium_photo-1675793715030-0584c8ec4a13?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            price: "$13.99",
            originalPrice: "$129.99"
        },
        {
            title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
            description: "Learn to create Machine Learning Algorithms in Python and R",
            image: "https://img-b.udemycdn.com/course/750x422/950390_270f_3.jpg",
            price: "$12.99",
            originalPrice: "$149.99"
        }
    ]

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('https://api.example.com/latest-courses?limit=5')
                setCourses(response.data)
            } catch (error) {
                console.error('Error fetching courses:', error)
                setCourses(defaultSlides)
            }
        }

        fetchCourses()
    }, [])

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % courses.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + courses.length) % courses.length)
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000) // Auto-advance every 5 seconds
        return () => clearInterval(timer)
    }, [courses.length])

    if (courses.length === 0) {
        return (
            <div className="flex justify-center items-center h-[400px] text-2xl font-semibold">
                Loading...
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-[1320px] mx-auto overflow-hidden px-4 rounded-lg">
            <div className="relative h-[400px]">
                {courses.map((course, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img src={course.image} alt={course.title} className="object-cover w-full h-full rounded-lg" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-6 rounded-b-lg">
                            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                            <p className="mb-2">{course.description}</p>
                            <div className="flex items-center">
                                <span className="text-xl font-bold mr-2">{course.price}</span>
                                <span className="text-sm line-through">{course.originalPrice}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>
        </div>
    )
}

export default ClientCarousel