import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    UserCheck, 
    UserX, 
    TrendingUp, 
    Activity,
    Calendar,
    Clock,
    Settings
} from 'lucide-react';
import { getAllUsersThunk } from '../features/admin/adminSlice';

const AdminOverview = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(getAllUsersThunk());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const totalUsers = users?.length || 0;
    const totalMembers = users?.reduce((acc, user) => {
        return acc + (user.members?.length || 0);
    }, 0);
    const approvedMembers = users?.reduce((acc, user) => {
        return acc + (user.members?.filter(member => member.isApproved)?.length || 0);
    }, 0);
    const pendingMembers = totalMembers - approvedMembers;

    const recentUsers = users?.slice(0, 5) || [];
    const recentMembers = users?.flatMap(user => 
        (user.members || []).map(member => ({
            ...member,
            userEmail: user.email
        }))
    ).slice(0, 5);

    const stats = [
        {
            name: 'Total Users',
            value: totalUsers,
            icon: Users,
            change: '+12%',
            changeType: 'positive',
            color: 'bg-blue-500'
        },
        {
            name: 'Total Members',
            value: totalMembers,
            icon: UserCheck,
            change: '+8%',
            changeType: 'positive',
            color: 'bg-green-500'
        },
        {
            name: 'Approved Members',
            value: approvedMembers,
            icon: UserCheck,
            change: '+15%',
            changeType: 'positive',
            color: 'bg-emerald-500'
        },
        {
            name: 'Pending Approvals',
            value: pendingMembers,
            icon: UserX,
            change: '-3%',
            changeType: 'negative',
            color: 'bg-orange-500'
        }
    ];

    const handleQuickAction = (path) => {
        navigate(path);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome to your admin dashboard. Here's what's happening with your contact directory.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6">
                        <dt>
                            <div className={`absolute rounded-md p-3 ${stat.color}`}>
                                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline">
                            <p className="text-xl sm:text-2xl font-semibold text-gray-900">{stat.value}</p>
                            <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {stat.change}
                            </p>
                        </dd>
                    </div>
                ))}
            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Recent Users */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-4 sm:px-6 sm:py-5">
                        <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900 mb-4">Recent Users</h3>
                        <div className="flow-root">
                            <ul className="-mb-6 sm:-mb-8">
                                {recentUsers.map((user, userIdx) => (
                                    <li key={user._id}>
                                        <div className="relative pb-6 sm:pb-8">
                                            {userIdx !== recentUsers.length - 1 ? (
                                                <span
                                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                    aria-hidden="true"
                                                />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                        <Users className="h-4 w-4 text-white" />
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-gray-500">
                                                            New user <span className="font-medium text-gray-900 truncate block">{user.email}</span> registered
                                                        </p>
                                                        <p className="text-xs text-gray-400">Category: {user.category || 'N/A'}</p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time dateTime={user.createdAt}>
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Recent Members */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-4 sm:px-6 sm:py-5">
                        <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900 mb-4">Recent Members</h3>
                        <div className="flow-root">
                            <ul className="-mb-6 sm:-mb-8">
                                {recentMembers.map((member, memberIdx) => (
                                    <li key={member._id}>
                                        <div className="relative pb-6 sm:pb-8">
                                            {memberIdx !== recentMembers.length - 1 ? (
                                                <span
                                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                    aria-hidden="true"
                                                />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                                        member.isApproved ? 'bg-green-500' : 'bg-orange-500'
                                                    }`}>
                                                        <UserCheck className="h-4 w-4 text-white" />
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm text-gray-500">
                                                            <span className="font-medium text-gray-900 truncate block">
                                                                {member.firstName} {member.lastName}
                                                            </span> added to {member.userEmail}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            Status: {member.isApproved ? 'Approved' : 'Pending'}
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                        <time dateTime={member.createdAt}>
                                                            {new Date(member.createdAt).toLocaleDateString()}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-4 sm:px-6 sm:py-5">
                    <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <button
                            onClick={() => handleQuickAction('/admin/users')}
                            className="relative rounded-lg border border-gray-300 bg-white px-4 py-4 sm:px-6 sm:py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all"
                        >
                            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Manage Users</p>
                                <p className="text-xs sm:text-sm text-gray-500">View and manage all users</p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleQuickAction('/admin/settings')}
                            className="relative rounded-lg border border-gray-300 bg-white px-4 py-4 sm:px-6 sm:py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all"
                        >
                            <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Analytics</p>
                                <p className="text-xs sm:text-sm text-gray-500">View detailed analytics</p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleQuickAction('/admin/settings')}
                            className="relative rounded-lg border border-gray-300 bg-white px-4 py-4 sm:px-6 sm:py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all"
                        >
                            <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">Settings</p>
                                <p className="text-xs sm:text-sm text-gray-500">Configure system settings</p>
                            </div>
                        </button>
                        <button
                            onClick={() => handleQuickAction('/admin/users')}
                            className="relative rounded-lg border border-gray-300 bg-white px-4 py-4 sm:px-6 sm:py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 transition-all"
                        >
                            <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">View Members</p>
                                <p className="text-xs sm:text-sm text-gray-500">Browse user members</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
