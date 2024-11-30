import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams để lấy tham số từ URL
import { Book, ChevronRight, Play } from 'lucide-react';

import { BASE_URL_API } from '../../../api/config'

const CourseInterface = () => {
    const { courseId } = useParams(); // Lấy courseId từ URL
    const [selectedTab, setSelectedTab] = useState('lessons');
    const [course, setCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`${BASE_URL_API}/lessons/course/${courseId}`);
                const data = await response.json();
                setCourse(data);
                console.log(data);
                setSelectedLesson(data[0].courseId); // Chọn bài học đầu tiên
                setLoading(false);
            } catch (error) {
                console.error('Error fetching course data:', error);
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!course) {
        return <div>No course data found.</div>;
    }

    const getYouTubeEmbedUrl = (videoId) => {
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const currentLesson = course.find(lesson => lesson.lessonId === selectedLesson) || course[0];
    const videoId = currentLesson.linkVideo || null;
    console.log(currentLesson);


    const renderTabContent = () => {
        switch (selectedTab) {
            case 'lessons':
                return (
                    <div className="space-y-4">
                        {course.map((lesson) => (
                            <div
                                key={lesson.lessonId}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedLesson === lesson.lessonId
                                    ? 'bg-blue-50 border-blue-500'
                                    : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedLesson(lesson.lessonId)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Book className="w-5 h-5 text-blue-500" />
                                        <span className='font-medium'>
                                            {lesson.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'exercises':
                return (
                    <div className="p-4 text-center">
                        <h2 className="text-lg font-semibold">Đang phát triển...</h2>
                        <p className="text-gray-500">Phần bài tập hiện đang được phát triển. Vui lòng quay lại sau.</p>
                    </div>
                );
            case 'submissions':
                return (
                    <div className="p-4 text-center">
                        <h2 className="text-lg font-semibold">Đang phát triển...</h2>
                        <p className="text-gray-500">Phần nộp bài hiện đang được phát triển. Vui lòng quay lại sau.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Video Section */}
                <div className="w-full md:w-2/3">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4">
                        {videoId ? (
                            <iframe
                                src={getYouTubeEmbedUrl(videoId)}
                                title={currentLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full rounded-lg"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Play className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{currentLesson.title}</h2>
                    <p className="text-gray-600 mb-4">{currentLesson.content}</p>
                </div>

                {/* Course Progress and Tabs */}
                <div className="w-full md:w-1/3">
                    <div className="mb-4">
                        <div className="flex border-b">
                            <button
                                className={`py-2 px-4 ${selectedTab === 'lessons' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setSelectedTab('lessons')}
                            >
                                Lessons
                            </button>
                            <button
                                className={`py-2 px-4 ${selectedTab === 'exercises' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setSelectedTab('exercises')}
                            >
                                Exercises
                            </button>
                            <button
                                className={`py-2 px-4 ${selectedTab === 'submissions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setSelectedTab('submissions')}
                            >
                                Submissions
                            </button>
                        </div>
                    </div>

                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default CourseInterface;