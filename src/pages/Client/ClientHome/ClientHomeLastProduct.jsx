/* eslint-disable react/prop-types */
import { useState } from 'react';
import ClientProduct from '../ClientProduct/ClientProduct';

const courses = [
    { id: 1, title: 'React for Beginners', category: 'Web Development', rating: 4.7, students: 10000, price: 19.99, image: 'https://media.licdn.com/dms/image/D4D12AQHLOphoHIjmoA/article-cover_image-shrink_720_1280/0/1680313616595?e=2147483647&v=beta&t=MDjk4m7S2o2GJeVZGRSsA8WkmumgdYuQiTZfQ2bRkBk' },
    { id: 2, title: 'Python Masterclass', category: 'Programming', rating: 4.8, students: 15000, price: 24.99, image: 'https://cdn.fs.teachablecdn.com/ju5fq6mRwOVwoMkb4B0g' },
    { id: 3, title: 'Machine Learning A-Z', category: 'Data Science', rating: 4.6, students: 12000, price: 29.99, image: 'https://img-c.udemycdn.com/course/750x422/950390_270f_3.jpg' },
    { id: 4, title: 'JavaScript: The Complete Guide', category: 'Web Development', rating: 4.9, students: 20000, price: 14.99, image: 'https://pictures.abebooks.com/isbn/9781565922341-us.jpg' },
    { id: 5, title: 'AWS Certified Solutions Architect', category: 'Cloud Computing', rating: 4.7, students: 8000, price: 34.99, image: 'https://img-c.udemycdn.com/course/750x422/5914092_588d_2.jpg' },
];

const categories = ['All', 'Web Development', 'Programming', 'Data Science', 'Cloud Computing'];

const currentlyLearning = [
    { id: 6, title: 'Advanced React Patterns', progress: 60, image: 'https://repository-images.githubusercontent.com/216153625/41239780-23f6-11ea-8641-8ac9a59db271' },
    { id: 7, title: 'Data Structures in Python', progress: 30, image: 'https://media.geeksforgeeks.org/wp-content/uploads/20211021164218/pythondatastructuresmin.png' },
];

const comingSoon = [
    { id: 8, title: 'Blockchain Fundamentals', releaseDate: '2023-08-15', image: 'https://media.licdn.com/dms/image/D5612AQGCmFLhbMBehg/article-cover_image-shrink_720_1280/0/1677769391978?e=2147483647&v=beta&t=yV2TNuKB9IWKBGWfcifbDkFEj6PDIeVOh-nAs25us-k' },
    { id: 9, title: 'AI Ethics and Governance', releaseDate: '2023-09-01', image: 'https://www.lumenova.ai/images/intersection-between-ai-ethics-ai-governance.jpg' },
];

const featured = [
    { id: 10, title: 'Full Stack Web Development', category: 'Web Development', rating: 4.9, students: 25000, price: 29.99, image: 'https://miro.medium.com/v2/resize:fit:1400/0*cl7fc6pt1MHjIF4K.png' },
    { id: 11, title: 'Data Science Bootcamp', category: 'Data Science', rating: 4.8, students: 18000, price: 39.99, image: 'https://img-b.udemycdn.com/course/750x422/1754098_e0df_3.jpg' },
];

const ClientHomeLastProduct = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('popularity');

    const filteredCourses = courses.filter(course =>
        selectedCategory === 'All' || course.category === selectedCategory
    );

    const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (sortBy === 'popularity') return b.students - a.students;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price') return a.price - b.price;
        return 0;
    });

    const CourseCard = ({ course }) => (
        <a href={<ClientProduct />} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-500 font-bold mr-1">{course.rating}</span>
                    <span className="text-sm text-gray-500">({course.students.toLocaleString()} students)</span>
                </div>
                <p className="font-bold">${course.price.toFixed(2)}</p>
            </div>
        </a>
    );

    return (
        <div className="font-sans max-w-7xl mx-auto py-6">
            <h1 className="text-3xl font-bold mb-8">Udemy Course Discovery</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Currently Learning</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentlyLearning.map(course => (
                        <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                <div className="bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-primary h-2 rounded-full"
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-600">{course.progress}% complete</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comingSoon.map(course => (
                        <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                <p className="text-sm text-gray-600">Release Date: {course.releaseDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">All Courses</h2>
                <div className="flex flex-col sm:flex-row justify-between mb-6">
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300
                  ${category === selectedCategory
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                    >
                        <option value="popularity">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        <option value="price">Lowest Price</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ClientHomeLastProduct;