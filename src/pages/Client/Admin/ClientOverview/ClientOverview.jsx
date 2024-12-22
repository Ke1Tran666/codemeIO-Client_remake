import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Users } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { BASE_URL_API } from '../../../../api/config';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const defaultDashboardData = {
    users: 1000,
    roles: [],
    activeUsers: 0
};

// eslint-disable-next-line react/prop-types
const Card = ({ title, value, icon: Icon, activeValue = 0, showChart = false, roles = [], users = [] }) => {
    const inactiveValue = value - activeValue;

    // Calculate user count for each role
    const roleCounts = roles.map(role => ({
        roleName: role.roleName,
        count: users.filter(user => user.roleId === role.roleId).length,
    }));

    const data = {
        labels: roleCounts.length > 0 ? roleCounts.map(role => role.roleName) : ['Active', 'Inactive'],
        datasets: [
            {
                data: roleCounts.length > 0 ? roleCounts.map(role => role.count) : [activeValue, inactiveValue],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(199, 199, 199, 0.6)',
                ],
                hoverBackgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                ],
            },
        ],
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-lg">
                    <h3 className="font-medium text-gray-500">{title}</h3>
                    <div className="font-bold text-gray-900">{value}</div>
                </div>
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            {showChart && <Pie data={data} />}
        </div>
    );
};

const ClientOverview = () => {
    const [dashboardData, setDashboardData] = useState(defaultDashboardData);
    const [users, setUsers] = useState([]);
    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersResponse, rolesResponse, activeUsersResponse] = await Promise.all([
                    axios.get(`${BASE_URL_API}/users`),
                    axios.get(`${BASE_URL_API}/roles`),
                    axios.get(`${BASE_URL_API}/users/status/active`),
                ]);

                setDashboardData({
                    users: usersResponse.data.length,
                    roles: rolesResponse.data,
                    activeUsers: activeUsersResponse.data.length,
                });

                // Store user data
                setUsers(usersResponse.data);

                // Fetch user roles for each user
                const userRolePromises = usersResponse.data.map(user =>
                    axios.get(`${BASE_URL_API}/userRoles/users/${user.userId}`)
                );
                const userRoleResponses = await Promise.all(userRolePromises);
                const userRolesData = userRoleResponses.map(response => response.data);
                setUserRoles(userRolesData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Filter users based on their roles
    const getUsersByRole = (roleId) => {
        return users.filter(user => {
            const userRole = userRoles.find(role => role.userId === user.userId);
            return userRole && userRole.roleId === roleId;
        });
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                <Card
                    title="Total Users"
                    value={dashboardData.users}
                    icon={Users}
                    activeValue={dashboardData.activeUsers}
                    showChart={true}
                />
                <Card
                    title="Total Roles"
                    value={dashboardData.roles.length}
                    icon={BarChart}
                    showChart={true}
                    roles={dashboardData.roles}
                    users={dashboardData.roles.map(role => ({
                        ...role,
                        users: getUsersByRole(role.roleId)
                    }))}
                />
            </div>
        </div>
    );
};

export default ClientOverview;