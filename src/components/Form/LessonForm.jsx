import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const LessonForm = ({ lesson, onClose, onSave, formAction }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        videoUrl: '',
        courseId: ''
    });
    const [videoFile, setVideoFile] = useState(null);

    useEffect(() => {
        if (lesson) {
            setForm(lesson);
        }
    }, [lesson]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form, videoFile);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {formAction === 'add' ? 'Add New Lesson' : 'Edit Lesson'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700">Video File</label>
                        <input
                            type="file"
                            id="videoFile"
                            name="videoFile"
                            onChange={handleFileChange}
                            accept="video/*"
                            className="mt-1 block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">Course ID</label>
                        <input
                            type="text"
                            id="courseId"
                            name="courseId"
                            value={form.courseId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {formAction === 'add' ? 'Add Lesson' : 'Update Lesson'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
LessonForm.propTypes = {
    lesson: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    formAction: PropTypes.string.isRequired
};

export default LessonForm;