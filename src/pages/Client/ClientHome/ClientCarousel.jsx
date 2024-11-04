'use client';
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ClientCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const slides = [
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

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000) // Auto-advance every 5 seconds
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="relative w-full max-w-[1320px] mx-auto overflow-hidden px-4 rounded-lg">
            <div className="relative h-[400px]">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img src={slide.image} alt={slide.title} className="object-cover w-full h-full rounded-lg" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-6 rounded-b-lg">
                            <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                            <p className="mb-2">{slide.description}</p>
                            <div className="flex items-center">
                                <span className="text-xl font-bold mr-2">{slide.price}</span>
                                <span className="text-sm line-through">{slide.originalPrice}</span>
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
};

export default ClientCarousel;