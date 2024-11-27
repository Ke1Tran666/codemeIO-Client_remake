import { useState } from 'react';
import { Book, CheckCircle, ChevronRight, Play, FileText, Upload } from 'lucide-react';

const CourseInterface = () => {
    const [selectedTab, setSelectedTab] = useState('lessons');

    // Mock course data
    const course = {
        title: "Introduction to React",
        description: "Learn the basics of React, including components, state, and props.",
        lessons: [
            { id: 1, title: "Getting Started with React", completed: true, videoUrl: "https://www.example.com/video1.mp4" },
            { id: 2, title: "Components and JSX", completed: true, videoUrl: "https://www.example.com/video2.mp4" },
            { id: 3, title: "State and Props", completed: false, videoUrl: "https://www.example.com/video3.mp4" },
            { id: 4, title: "Hooks and Effect", completed: false, videoUrl: "https://www.example.com/video4.mp4" },
            { id: 5, title: "Routing in React", completed: false, videoUrl: "https://www.example.com/video5.mp4" },
        ],
        exercises: [
            { id: 1, title: "Setup React Environment", lessonId: 1 },
            { id: 2, title: "Create Your First Component", lessonId: 1 },
            { id: 3, title: "Create a Functional Component", lessonId: 2 },
            { id: 4, title: "Create a Class Component", lessonId: 2 },
            { id: 5, title: "Implement State in a Component", lessonId: 3 },
            { id: 6, title: "Pass Props Between Components", lessonId: 3 },
        ],
        submissions: [
            { id: 1, title: "Environment Screenshot", lessonId: 1 },
            { id: 2, title: "First Component Code", lessonId: 1 },
            { id: 3, title: "Functional Component Code", lessonId: 2 },
            { id: 4, title: "Class Component Code", lessonId: 2 },
            { id: 5, title: "State Implementation Code", lessonId: 3 },
            { id: 6, title: "Props Usage Code", lessonId: 3 },
        ],
    };

    const [selectedLesson, setSelectedLesson] = useState(course.lessons[0].id);

    const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
    const progress = (completedLessons / course.lessons.length) * 100;

    const currentLesson = course.lessons.find(lesson => lesson.id === selectedLesson) || course.lessons[0];

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'lessons':
                return (
                    <div className="space-y-4">
                        {course.lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedLesson === lesson.id
                                    ? 'bg-blue-50 border-blue-500'
                                    : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedLesson(lesson.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Book className="w-5 h-5 text-blue-500" />
                                        <span className={lesson.completed ? 'text-gray-500' : 'font-medium'}>
                                            {lesson.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {lesson.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'exercises':
                return (
                    <div className="space-y-4">
                        {course.exercises.map((exercise) => (
                            <div key={exercise.id} className="p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    <span>{exercise.title}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Lesson: {course.lessons.find(l => l.id === exercise.lessonId)?.title}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'submissions':
                return (
                    <div className="space-y-4">
                        {course.submissions.map((submission) => (
                            <div key={submission.id} className="p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <Upload className="w-5 h-5 text-blue-500" />
                                    <span>{submission.title}</span>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">
                                    Lesson: {course.lessons.find(l => l.id === submission.lessonId)?.title}
                                </div>
                            </div>
                        ))}
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
                        {currentLesson.videoUrl ? (
                            <video
                                src={currentLesson.videoUrl}
                                controls
                                className="w-full h-full object-cover rounded-lg"
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Play className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{currentLesson.title}</h2>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                </div>

                {/* Course Progress and Tabs */}
                <div className="w-full md:w-1/3">
                    <div className="mb-6 bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Course Progress</h2>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {completedLessons} of {course.lessons.length} lessons completed
                        </p>
                    </div>

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

