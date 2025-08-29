import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Users, 
    UserCheck, 
    UserX, 
    TrendingUp, 
    Activity,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { getAllUsersThunk } from '../features/admin/adminSlice';

const AdminDashboard = ({ children, activePage }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { users, loading } = useSelector((state) => state.admin);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(getAllUsersThunk());
    }, [dispatch]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarOpen && !event.target.closest('.sidebar-container')) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    const totalUsers = users?.length || 0;
    const approvedMembers = users?.reduce((acc, user) => {
        return acc + (user.members?.filter(member => member.isApproved)?.length || 0);
    }, 0);
    const pendingMembers = users?.reduce((acc, user) => {
        return acc + (user.members?.filter(member => !member.isApproved)?.length || 0);
    }, 0);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleNavigation = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const navigation = [
        { name: 'Dashboard', path: '/admin', icon: Activity, current: activePage === 'dashboard' },
        { name: 'Users', path: '/admin/users', icon: Users, current: activePage === 'users' },
        { name: 'Settings', path: '/admin/settings', icon: Settings, current: activePage === 'settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" />
            )}

            {/* Mobile sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Mobile sidebar header */}
                    <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
                        <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Mobile sidebar navigation */}
                    <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.path)}
                                className={`group flex w-full items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    item.current
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* Mobile sidebar footer */}
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    <div className="flex h-16 items-center px-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.path)}
                                className={`group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                                    item.current
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                {item.name}
                            </button>
                        ))}
                    </nav>
                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    
                    {/* Mobile title */}
                    <h1 className="text-lg font-semibold text-gray-900 lg:hidden">
                        {navigation.find(item => item.current)?.name || 'Admin'}
                    </h1>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1"></div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
                            <div className="flex items-center gap-x-4">
                                <span className="hidden sm:block text-sm font-medium text-gray-700">Admin</span>
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium text-gray-600">A</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-4 sm:py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="min-h-[calc(100vh-8rem)]">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
