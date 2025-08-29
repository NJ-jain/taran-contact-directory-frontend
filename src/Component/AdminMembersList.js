import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Search, 
    Filter, 
    UserCheck, 
    UserX, 
    Users,
    Calendar,
    Mail,
    Phone,
    Image,
    CheckCircle,
    XCircle,
    Eye
} from 'lucide-react';
import { getAllUsersThunk, approveMemberThunk } from '../features/admin/adminSlice';

const AdminMembersList = () => {
    const dispatch = useDispatch();
    const { users, loading, error, approvalLoading, approvalError } = useSelector((state) => state.admin);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        dispatch(getAllUsersThunk());
    }, [dispatch]);

    const handleApprovalToggle = (memberId) => {
        dispatch(approveMemberThunk(memberId));
    };

    // Flatten all members from all users with user context
    const allMembers = users?.flatMap(user => 
        (user.members || []).map(member => ({
            ...member,
            userEmail: user.email,
            userCategory: user.category,
            userId: user._id
        }))
    ) || [];

    // Filter and sort members
    const filteredAndSortedMembers = allMembers
        .filter(member => {
            const matchesSearch = 
                member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = filterStatus === 'all' || 
                (filterStatus === 'approved' && member.isApproved) ||
                (filterStatus === 'pending' && !member.isApproved);
            
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];
            
            if (sortBy === 'createdAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (sortBy === 'name') {
                aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
                bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
            }
            
            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const totalMembers = allMembers.length;
    const approvedMembers = allMembers.filter(member => member.isApproved).length;
    const pendingMembers = totalMembers - approvedMembers;

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
                        <h3 className="text-sm font-medium text-red-800">Error loading members</h3>
                        <div className="mt-2 text-sm text-red-700">{error.message}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage all members across all contact directories and approve pending requests.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                                    <dd className="text-lg font-medium text-gray-900">{totalMembers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UserCheck className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                                    <dd className="text-lg font-medium text-gray-900">{approvedMembers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UserX className="h-6 w-6 text-orange-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                    <dd className="text-lg font-medium text-gray-900">{pendingMembers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Calendar className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">New This Month</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {allMembers.filter(member => {
                                            const memberDate = new Date(member.createdAt);
                                            const now = new Date();
                                            return memberDate.getMonth() === now.getMonth() && 
                                                   memberDate.getFullYear() === now.getFullYear();
                                        }).length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and search */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        {/* Search */}
                        <div className="sm:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Search Members
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Search by name, email, or user..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Status filter */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                id="status"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
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
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Members list */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredAndSortedMembers.map((member) => (
                        <li key={member._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-12">
                                            {member.dp ? (
                                                <img 
                                                    className="h-12 w-12 rounded-full object-cover" 
                                                    src={member.dp} 
                                                    alt={`${member.firstName} ${member.lastName}`} 
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <Image className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    member.isApproved 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-orange-100 text-orange-800'
                                                }`}>
                                                    {member.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p>{member.email}</p>
                                            </div>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p>Added to {member.userEmail}</p>
                                                {member.userCategory && (
                                                    <span className="ml-2 text-xs text-gray-400">
                                                        ({member.userCategory})
                                                    </span>
                                                )}
                                            </div>
                                            {member.phoneNumber && (
                                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                                    <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    <p>{member.phoneNumber}</p>
                                                </div>
                                            )}
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                <p>Added {new Date(member.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleApprovalToggle(member._id)}
                                            disabled={approvalLoading}
                                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                member.isApproved
                                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                            } ${approvalLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {approvalLoading ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                            ) : member.isApproved ? (
                                                <>
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    Reject
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Approve
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                
                {filteredAndSortedMembers.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterStatus !== 'all' 
                                ? 'Try adjusting your search or filter criteria.' 
                                : 'No members have been added yet.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Error message */}
            {approvalError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error updating member</h3>
                            <div className="mt-2 text-sm text-red-700">{approvalError.message}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMembersList;
