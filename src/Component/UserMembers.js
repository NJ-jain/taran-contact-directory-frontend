import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserMembersThunk, approveMemberThunk, getAllUsersThunk } from '../features/admin/adminSlice';
import { Image, ArrowLeft, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';

const UserMembers = ({ userId: propUserId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams();
    const userId = propUserId || paramUserId;
    
    const { 
        users, 
        selectedUserMembers, 
        totalMembers, 
        membersLoading, 
        membersError,
        approvalLoading,
        approvalError 
    } = useSelector((state) => state.admin);

    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        // Fetch all users to get the selected user data
        dispatch(getAllUsersThunk());
    }, [dispatch]);

    useEffect(() => {
        // Find the selected user from the users array
        if (users && userId) {
            const user = users.find(u => u._id === userId);
            setSelectedUser(user);
        }
    }, [users, userId]);

    useEffect(() => {
        if (userId) {
            dispatch(getUserMembersThunk(userId));
        }
    }, [dispatch, userId]);

    const handleApprovalToggle = (memberId) => {
        dispatch(approveMemberThunk(memberId));
    };

    const handleBack = () => {
        navigate('/admin/users');
    };

    if (membersLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (membersError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading members</h3>
                        <div className="mt-2 text-sm text-red-700">{membersError.message}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedUser) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900">User not found</h3>
                    <p className="text-sm text-gray-500">The requested user could not be found.</p>
                </div>
            </div>
        );
    }

    const approvedMembers = selectedUserMembers?.filter(member => member.isApproved).length || 0;
    const pendingMembers = totalMembers - approvedMembers;

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleBack}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {selectedUser.email} - Members
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage members for this user's contact directory
                    </p>
                </div>
            </div>

            {/* User info card */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                            {selectedUser.banner ? (
                                <img 
                                    className="h-16 w-16 rounded-full object-cover" 
                                    src={selectedUser.banner} 
                                    alt="User avatar" 
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Image className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{selectedUser.email}</h3>
                            {selectedUser.category && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {selectedUser.category}
                                </span>
                            )}
                            <p className="text-sm text-gray-500">
                                Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Image className="h-6 w-6 text-gray-400" />
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
                                <CheckCircle className="h-6 w-6 text-green-400" />
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
                                <XCircle className="h-6 w-6 text-orange-400" />
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
            </div>
            
            {/* Members list */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Members List</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {selectedUserMembers?.map((member) => (
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
                
                {selectedUserMembers?.length === 0 && (
                    <div className="text-center py-12">
                        <Image className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            This user hasn't added any members to their contact directory yet.
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

export default UserMembers; 