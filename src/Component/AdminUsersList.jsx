import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Filter, 
    MoreVertical, 
    Eye, 
    Users,
    Calendar,
    Mail,
    Phone,
    Image
} from 'lucide-react';
import { getAllUsersThunk } from '../features/admin/adminSlice';

const AdminUsersList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading, error } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        dispatch(getAllUsersThunk());
    }, [dispatch]);

    const handleUserClick = (user) => {
        navigate(`/admin/members/${user._id}`);
    };

    // Filter and sort users
    const filteredAndSortedUsers = users
        ?.filter(user => {
            const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.category?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'all' || user.category === filterCategory;
            return matchesSearch && matchesCategory;
        })
        ?.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (sortBy === 'createdAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        }) || [];

    const categories = [...new Set(users?.map(user => user.category).filter(Boolean))];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
                        <div className="mt-2 text-sm text-red-700">{error.message}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Users Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage all registered users and their contact directories.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4 sm:p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                            </div>
                            <div className="ml-4 sm:ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                    <dd className="text-lg font-medium text-gray-900">{users?.length || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4 sm:p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                            </div>
                            <div className="ml-4 sm:ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Directories</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {users?.filter(user => user.members?.length > 0).length || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4 sm:p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                            </div>
                            <div className="ml-4 sm:ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">New This Month</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {users?.filter(user => {
                                            const userDate = new Date(user.createdAt);
                                            const now = new Date();
                                            return userDate.getMonth() === now.getMonth() && 
                                                   userDate.getFullYear() === now.getFullYear();
                                        }).length || 0}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and search */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-4 sm:px-6 sm:py-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Search */}
                        <div className="sm:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Search Users
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Search by email or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Category filter */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                id="category"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                id="sort"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                                    setSortBy(newSortBy);
                                    setSortOrder(newSortOrder);
                                }}
                            >
                                <option value="createdAt-desc">Newest First</option>
                                <option value="createdAt-asc">Oldest First</option>
                                <option value="email-asc">Email A-Z</option>
                                <option value="email-desc">Email Z-A</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users list */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredAndSortedUsers.map((user) => (
                        <li key={user._id}>
                            <div 
                                className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center min-w-0 flex-1">
                                        <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12">
                                            {user.banner ? (
                                                <img 
                                                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" 
                                                    src={user.banner} 
                                                    alt="User avatar" 
                                                />
                                            ) : (
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <Image className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                                {user.category && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                                                        {user.category}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p className="truncate">
                                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p className="truncate">
                                                    {user.members?.length || 0} members
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center ml-4">
                                        <button className="text-gray-400 hover:text-gray-500 p-1">
                                            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                
                {filteredAndSortedUsers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterCategory !== 'all' 
                                ? 'Try adjusting your search or filter criteria.' 
                                : 'No users have been registered yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsersList;
