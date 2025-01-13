import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Star, Check } from 'lucide-react';
import { useNotification } from '../../../components/Notification/NotificationContext';
import { BASE_URL, BASE_URL_API } from '../../../api/config';
import axios from 'axios';

const ClientProduct = () => {
    const location = useLocation();
    const { course } = location.state || {}; // Nhận dữ liệu khóa học
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    // Cuộn lên đầu trang khi component được tải
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handlePurchase = async () => {
        const isLoggedIn = localStorage.getItem('user');

        if (!isLoggedIn) {
            navigate('/signin');
            return;
        }

        const userId = JSON.parse(isLoggedIn).userId;

        try {
            const userResponse = await axios.get(`${BASE_URL_API}/users/${userId}`);

            const paymentData = {
                student: { userId: userResponse.data.userId },
                course: course,
                addedDate: new Date().toISOString(),
                paymentStatus: false
            };

            const response = await axios.post(`${BASE_URL_API}/payments`, paymentData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Kiểm tra phản hồi từ API
            if (response.status === 201) {
                showNotification('success', 'Success', 'Khóa học đã được thêm vào giỏ hàng!');
                // Lưu khóa học vào localStorage với key "courses" và giá trị là mảng rỗng
                localStorage.setItem('courses', JSON.stringify([]));
            } else if (response.status === 200) {
                // Nếu trả về 200 khi khóa học đã tồn tại
                showNotification('error', 'Error', 'Khóa học đã được thêm rồi.');
            } else {
                showNotification('error', 'Error', 'Đã có lỗi xảy ra khi thêm khóa học.');
            }
        } catch (error) {
            // Xử lý lỗi nếu có
            if (error.response) {
                showNotification('error', 'Error', 'Lỗi: ' + (error.response.data.message || 'Đã có lỗi xảy ra khi kết nối đến server.'));
            } else {
                showNotification('error', 'Error', 'Đã có lỗi xảy ra khi kết nối đến server.');
            }
        }
    };

    if (!course) {
        return <div className="text-center">Khóa học không tồn tại.</div>;
    }

    return (
        <main className="container mx-auto mt-[74px]">
            <div className="max-w-[1320px] w-full mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                        <p className="text-xl mb-4">{course.description}</p>
                        <div className="flex items-center mb-4">
                            <div className="flex items-center mr-4">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="w-5 h-5 text-yellow-400 mr-1" />
                                ))}
                            </div>
                            <span className="text-lg font-semibold">{course.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground ml-2">(Đánh giá từ {course.totalStudents} học viên)</span>
                        </div>
                        <div className="border rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4">Bạn sẽ học được gì</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {/* Danh sách nội dung khóa học */}
                                {[
                                    "Xây dựng ứng dụng React quy mô lớn.",
                                    "Học các tính năng mới nhất của React.",
                                    "Làm quen với Redux và Hooks.",
                                    "Triển khai ứng dụng lên môi trường sản xuất."
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <h2 className="text-2xl font-semibold mb-4">Mô tả khóa học</h2>
                        <p className="mb-4">
                            Đây là khóa học hoàn chỉnh với tất cả các tính năng mới nhất của React. Tham gia vào cộng đồng học viên lớn và nhận chứng chỉ sau khi hoàn thành khóa học.
                        </p>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 sticky top-4 bg-white">
                            <img src={`${BASE_URL}${course.imageCourses}`} alt={course.title} className="mt-4 w-full rounded h-40 object-cover" />
                            <div className="mb-4">
                                <span className="text-3xl font-bold">${course.price.toFixed(2)}</span>
                            </div>
                            <button
                                className="w-full mb-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
                                onClick={handlePurchase}
                            >
                                {localStorage.getItem('user') ? 'Mua ngay' : 'Đăng nhập hoặc đăng ký để mua khóa học'}
                            </button>
                            <p className="text-center text-sm mb-4">Chính sách hoàn tiền trong 30 ngày</p>
                        </div>
                    </div>
                </div>
                {/* <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Bình luận</h2>
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        rows="4"
                        placeholder="Để lại bình luận..."
                    />
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">Gửi</button>
                </div> */}
            </div>
        </main>
    );
};

export default ClientProduct;