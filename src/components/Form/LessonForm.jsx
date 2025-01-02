import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import axios from 'axios';

const LessonForm = ({ lesson, onClose, onSave, formAction, courses }) => {
    const [lessonForm, setLessonForm] = useState({
        title: '',
        description: '',
        linkVideo: '',
        courseId: 0
    });
    const [uploadForm, setUploadForm] = useState({
        title: '',
        description: '',
        file: null
    });
    const [fileName, setFileName] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, setUploadId] = useState(null);
    const [isFormLocked, setIsFormLocked] = useState(false);

    useEffect(() => {
        if (lesson) {
            if (formAction === 'edit') {
                setLessonForm({
                    title: lesson.title || '',
                    description: lesson.description || '',
                    linkVideo: lesson.linkVideo || '',
                    courseId: lesson.course?.courseId || 0
                });
            } else if (formAction === 'add') {
                const course = courses.find(course => course.courseId === lesson.courseId);
                setLessonForm({
                    title: '',
                    description: '',
                    linkVideo: '',
                    courseId: course ? course.courseId : 0
                });
            }
        }
    }, [lesson, formAction, courses]);

    const handleLessonChange = (e) => {
        const { name, value } = e.target;
        setLessonForm(prevForm => ({
            ...prevForm,
            [name]: value || ''
        }));
    };

    const handleUploadChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setUploadForm(prevForm => ({
                ...prevForm,
                file: files[0]
            }));
            setFileName(files[0].name);
        } else {
            setUploadForm(prevForm => ({
                ...prevForm,
                [name]: value
            }));
        }
    };

    const handleLessonSubmit = (e) => {
        e.preventDefault();
        console.log('Lesson data submitted:', lessonForm); // In ra dữ liệu
        onSave(lessonForm);
    };

    const handleUploadSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmedUpload = async () => {
        const formData = new FormData();
        formData.append("title", uploadForm.title);
        formData.append("description", uploadForm.description);
        formData.append("videoFile", uploadForm.file);

        setIsLoading(true);
        setShowConfirmation(false);

        try {
            const response = await axios.post("http://localhost:3001/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.authUrl && response.data.uploadId) {
                setUploadId(response.data.uploadId);
                window.open(response.data.authUrl, "_blank");
                pollUploadStatus(response.data.uploadId);
            }
        } catch (error) {
            console.error("There was an error uploading the file!", error);
            setIsLoading(false);
        }
    };

    const pollUploadStatus = async (uploadId) => {
        const pollInterval = setInterval(async () => {
            try {
                const response = await axios.get(`http://localhost:3001/upload-status/${uploadId}`);
                if (response.data.status === 'completed') {
                    clearInterval(pollInterval);
                    setResponseData(response.data);
                    setIsLoading(false);
                    setIsFormLocked(true);
                    // Update lessonForm with the new video link
                    setLessonForm(prevForm => ({
                        ...prevForm,
                        title: response.data.title,
                        description: response.data.description,
                        linkVideo: response.data.videoId
                    }));
                } else if (response.data.status === 'error') {
                    clearInterval(pollInterval);
                    setIsLoading(false);
                    console.error("Upload failed");
                }
            } catch (error) {
                console.error("Error polling upload status:", error);
                clearInterval(pollInterval);
                setIsLoading(false);
            }
        }, 5000); // Poll every 5 seconds
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl m-4">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {formAction === 'add' ? 'Add New Lesson' : 'Edit Lesson'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex">
                    {/* UploadForm */}
                    <div className="w-1/2 p-6 border-r">
                        <h3 className="text-lg font-semibold mb-4">Upload Video</h3>
                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="uploadTitle" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="uploadTitle"
                                    name="title"
                                    value={uploadForm.title}
                                    onChange={handleUploadChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                                    required
                                    disabled={isFormLocked}
                                />
                            </div>
                            <div>
                                <label htmlFor="uploadDescription" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="uploadDescription"
                                    name="description"
                                    value={uploadForm.description}
                                    onChange={handleUploadChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                                    required
                                    disabled={isFormLocked}
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Video File</label>
                                <label className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-gray-400 transition-colors ${isFormLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={handleUploadChange}
                                        accept="video/*"
                                        className="sr-only"
                                        disabled={isFormLocked}
                                    />
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <span className="relative bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                Upload a file
                                            </span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {fileName || "MP4, WebM, or Ogg up to 5GB"}
                                        </p>
                                    </div>
                                </label>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    type="submit"
                                    className="flex-shrink-0 w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading || isFormLocked}
                                >
                                    Upload Video
                                </button>
                                <div className="flex-grow">
                                    {isLoading && (
                                        <p className="text-sm text-gray-600">
                                            Uploading video... Please complete the authorization in the new window.
                                        </p>
                                    )}
                                    {responseData && responseData.videoId && (
                                        <p className="text-sm text-green-600 font-semibold">
                                            Upload Successful
                                        </p>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* LessonForm */}
                    <div className="w-1/2 p-6">
                        <h3 className="text-lg font-semibold mb-4">Lesson Details</h3>
                        <form onSubmit={handleLessonSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={lessonForm.title}
                                    onChange={handleLessonChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={lessonForm.description}
                                    onChange={handleLessonChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="linkVideo" className="block text-sm font-medium text-gray-700">Video Link</label>
                                <input
                                    type="text"
                                    id="linkVideo"
                                    name="linkVideo"
                                    value={lessonForm.linkVideo}
                                    onChange={handleLessonChange}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Video link will appear here after upload"
                                    readOnly
                                />
                            </div>
                            <div>
                                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course</label>
                                <input
                                    type="text"
                                    id="courseId"
                                    name="courseId"
                                    value={courses.find(course => course.courseId === lessonForm.courseId)?.title || ''}
                                    className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500"
                                    readOnly
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    {formAction === 'add' ? 'Add Lesson' : 'Update Lesson'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showConfirmation && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Upload</h2>
                        <p>Are you sure you want to upload this video?</p>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmedUpload}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Confirm Upload
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

LessonForm.propTypes = {
    lesson: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    formAction: PropTypes.string.isRequired,
    courses: PropTypes.array.isRequired
};

export default LessonForm;