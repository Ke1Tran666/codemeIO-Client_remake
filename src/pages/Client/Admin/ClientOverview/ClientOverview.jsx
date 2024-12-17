import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Users, BookOpen, FileText, Tag } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { BASE_URL_API } from '../../../../api/config';

// Đăng ký các thành phần của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const defaultDashboardData = {
    categories: 10,
    courses: 50,
    lessons: 500,
    users: 1000,
    roles: 5,
    activeUsers: 0
};

// eslint-disable-next-line react/prop-types
const Card = ({ title, value, icon: Icon, activeValue, showChart = true }) => {
    const inactiveValue = value - activeValue;
    const data = {
        labels: ['Active', 'Inactive'],
        datasets: [
            {
                data: [activeValue, inactiveValue],
                backgroundColor: ['rgba(44, 143, 255, 0.6)', 'rgba(254, 226, 226, 0.6)'],
                hoverBackgroundColor: ['rgba(44, 143, 255, 1)', 'rgba(254, 226, 226, 1)'],
            },
        ],
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {showChart && <Pie data={data} />} {/* Chỉ hiển thị biểu đồ khi showChart true */}
        </div>
    );
};

const ClientOverview = () => {
    const [dashboardData, setDashboardData] = useState(defaultDashboardData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, coursesResponse, lessonsResponse, usersResponse, rolesResponse, activeUsersResponse] = await Promise.all([
                    axios.get(`${BASE_URL_API}/categories`),
                    axios.get(`${BASE_URL_API}/courses`),
                    axios.get(`${BASE_URL_API}/lessons`),
                    axios.get(`${BASE_URL_API}/users`),
                    axios.get(`${BASE_URL_API}/roles`),
                    axios.get(`${BASE_URL_API}/users/status/active`),
                ]);

                setDashboardData({
                    categories: categoriesResponse.data.length,
                    courses: coursesResponse.data.length,
                    lessons: lessonsResponse.data.length,
                    users: usersResponse.data.length,
                    roles: rolesResponse.data.length,
                    activeUsers: activeUsersResponse.data.length,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card title="Total Categories" value={dashboardData.categories} icon={Tag} activeValue={0} /> {/* Không có active cho Categories */}
                <Card title="Total Courses" value={dashboardData.courses} icon={BookOpen} activeValue={0} /> {/* Hiển thị biểu đồ */}
                <Card title="Total Users" value={dashboardData.users} icon={Users} activeValue={dashboardData.activeUsers} />
                <Card title="Total Lessons" value={dashboardData.lessons} icon={FileText} activeValue={0} showChart={false} /> {/* Không hiển thị biểu đồ */}
                <Card title="Total Roles" value={dashboardData.roles} icon={BarChart} activeValue={0} showChart={false} /> {/* Không hiển thị biểu đồ */}
            </div>
        </div>
    );
};

export default ClientOverview;
