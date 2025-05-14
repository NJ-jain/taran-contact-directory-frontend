import { CircleCheck, CircleX, Image, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsersThunk, setSelectedUser } from '../features/admin/adminSlice'
import UserMembers from './UserMembers'

const Admin = () => {
    const dispatch = useDispatch()
    const { users, loading, error, selectedUser } = useSelector((state) => state.admin)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        dispatch(getAllUsersThunk())
    }, [dispatch])

    // Filter users based on search term
    const filteredUsers = users?.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleUserClick = (user) => {
        dispatch(setSelectedUser(user));
    };

    const handleBack = () => {
        dispatch(setSelectedUser(null));
    };

    if (loading) return <div className="p-4">Loading...</div>
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>

    // If a user is selected, show the UserMembers component
    if (selectedUser) {
        return <UserMembers onBack={handleBack} />;
    }

    return (
        <div className='p-4 flex-col flex gap-2'>
            <div>
                <label htmlFor="searchInput">Search</label>
                <div className='flex justify-start items-center gap-2 p-4 border rounded-lg w-full'>
                    <Search />
                    <input 
                        type='text' 
                        id="searchInput" 
                        placeholder='Search by email or category' 
                        className='w-full outline-none'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <h2 className='text-lg font-semibold'>
                People ({filteredUsers?.length || 0})
            </h2>
            
            <ul className="space-y-2">
                {filteredUsers?.map(user => (
                    <li 
                        key={user._id} 
                        className='flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer'
                        onClick={() => handleUserClick(user)}
                    >
                        <span className='flex justify-start items-center gap-2 w-full'>
                            {user.banner ? (
                                <img 
                                    src={user.banner} 
                                    alt="User" 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <Image className="w-10 h-10 p-2 bg-gray-100 rounded-full" />
                            )}
                            <div className="flex flex-col">
                                <span className="font-medium">{user.email}</span>
                                <span className="text-sm text-gray-500">{user.category}</span>
                            </div>
                        </span>
                        {/* <span className='flex justify-end items-center gap-2'>
                            <button 
                                className="text-red-500 hover:text-red-600"
                                title="Reject"
                            >
                                <CircleX size={32} />
                            </button>
                            <button 
                                className="text-green-500 hover:text-green-600"
                                title="Approve"
                            >
                                <CircleCheck size={32} />
                            </button>
                        </span> */}
                    </li>
                ))}
                {filteredUsers?.length === 0 && (
                    <li className="text-center text-gray-500 py-4">
                        No users found
                    </li>
                )}
            </ul>
        </div>
    )
}

export default Admin