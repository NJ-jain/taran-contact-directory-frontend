import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserMembersThunk, approveMemberThunk } from '../features/admin/adminSlice';
import { Image, ArrowLeft } from 'lucide-react';

const UserMembers = ({ onBack }) => {
    const dispatch = useDispatch();
    const { 
        selectedUser, 
        selectedUserMembers, 
        totalMembers, 
        membersLoading, 
        membersError,
        approvalLoading,
        approvalError 
    } = useSelector((state) => state.admin);

    useEffect(() => {
        if (selectedUser) {
            dispatch(getUserMembersThunk(selectedUser._id));
        }
    }, [dispatch, selectedUser]);

    const handleApprovalToggle = (memberId) => {
        dispatch(approveMemberThunk(memberId));
    };

    if (membersLoading) return <div className="p-4">Loading members...</div>;
    if (membersError) return <div className="p-4 text-red-500">Error: {membersError.message}</div>;
    if (!selectedUser) return null;

    return (
        <div className='p-4 flex-col flex gap-2'>
            <div className="flex items-center gap-2 mb-4">
                <button 
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-semibold">
                    {selectedUser.email} - Members ({totalMembers})
                </h2>
            </div>
            
            <ul className="space-y-2">
                {selectedUserMembers?.map(member => (
                    <li key={member._id} className='flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50'>
                        <span className='flex justify-start items-center gap-2 w-full'>
                            {member.dp ? (
                                <img 
                                    src={member.dp} 
                                    alt={`${member.firstName} ${member.lastName}`} 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <Image className="w-10 h-10 p-2 bg-gray-100 rounded-full" />
                            )}
                            <div className="flex flex-col">
                                <span className="font-medium">{member.firstName} {member.lastName}</span>
                                <span className="text-sm text-gray-500">{member.email}</span>
                                {member.phoneNumber && (
                                    <span className="text-sm text-gray-500">{member.phoneNumber}</span>
                                )}
                            </div>
                        </span>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={member.isApproved}
                                    onChange={() => handleApprovalToggle(member._id)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    disabled={approvalLoading}
                                />
                                <span className="text-sm text-gray-600">
                                    {member.isApproved ? 'Approved' : 'Not Approved'}
                                </span>
                            </label>
                        </div>
                    </li>
                ))}
                {selectedUserMembers?.length === 0 && (
                    <li className="text-center text-gray-500 py-4">
                        No members found for this user
                    </li>
                )}
            </ul>
            {approvalError && (
                <div className="text-red-500 text-sm mt-2">
                    Error: {approvalError.message}
                </div>
            )}
        </div>
    );
};

export default UserMembers; 