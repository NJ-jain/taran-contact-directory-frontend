import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMemberThunk } from "../features/member/memberSlice";
import Navbar from "./Navbar";
import { Phone, Mail, MapPin, Calendar, Users, ArrowLeft, User } from 'lucide-react';

const Details = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const memberData = useSelector((state) => state.member.member);
    const member = memberData?.member || {};
    const loading = memberData?.loading;
    const error = memberData?.error;

    useEffect(() => {
        if (id) {
            dispatch(getMemberThunk({ id }));
        }
    }, [dispatch, id]);

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading contact</h3>
                        <p className="mt-1 text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Loading State */}
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 shadow-xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-3 text-gray-600 text-sm">Loading contact details...</p>
                        </div>
                    </div>
                )}

                {member && Object.keys(member).length > 0 && (
                    <>
                        {/* Header with Back Button */}
                        <div className="bg-white shadow-soft border-b border-gray-100">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to contacts
                                </button>
                            </div>
                        </div>

                        {/* Hero Section with Banner */}
                        <div className="relative">
                            {/* Banner Image */}
                            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{
                                        backgroundImage: member?.userId?.banner
                                            ? `url('${member.userId.banner}')`
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}
                                >
                                    {/* Overlay for better text readability */}
                                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                                </div>

                                {/* Profile Picture Overlay */}

                            </div>

                            {/* Name and Title Section */}
                            <div className="bg-white pt-20 pb-8 relative">
                                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                                    <div className="relative">
                                        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full p-2 shadow-xl">
                                            <img
                                                className="w-full h-full rounded-full object-cover border-4 border-white"
                                                src={member.dp || 'https://via.placeholder.com/160x160/6B7280/FFFFFF?text=' + (member.firstName?.charAt(0) || '?')}
                                                alt={`${member.firstName} ${member.lastName}`}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/160x160/6B7280/FFFFFF?text=' + (member.firstName?.charAt(0) || '?');
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                        {member.firstName} {member.lastName}
                                    </h1>
                                    <p className="text-lg text-gray-600">
                                        Contact Details
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
                                <div className="px-6 py-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

                                    <div className="space-y-6">
                                        {member.email && (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                        <Mail className="h-5 w-5 text-primary-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                                    <p className="text-lg text-gray-900">{member.email}</p>
                                                </div>
                                            </div>
                                        )}

                                        {member.phoneNumber && (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                        <Phone className="h-5 w-5 text-primary-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                                    <p className="text-lg text-gray-900">{member.phoneNumber}</p>
                                                </div>
                                            </div>
                                        )}

                                        {member.address && (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                        <MapPin className="h-5 w-5 text-primary-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                                    <p className="text-lg text-gray-900 capitalize">{member.address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {member.dob && (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                        <Calendar className="h-5 w-5 text-primary-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                                    <p className="text-lg text-gray-900">{member.dob}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Family Members Section */}
                            {member?.userId?.membersArray && member.userId.membersArray.length > 0 && (
                                <div className="mt-8">
                                    <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
                                        <div className="px-6 py-8">
                                            <div className="flex items-center mb-6">
                                                <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                                                    <Users className="h-5 w-5 text-primary-600" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-900">Family Members</h2>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {[...member.userId.membersArray]
                                                    .sort((a, b) => a.firstName.localeCompare(b.firstName))
                                                    .map((familyMember) => (
                                                        <div
                                                            key={familyMember._id}
                                                            onClick={() => navigate(`/details/${familyMember._id}`)}
                                                            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer group"
                                                        >
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors duration-200"
                                                                    src={familyMember.dp || 'https://via.placeholder.com/48x48/6B7280/FFFFFF?text=' + (familyMember.firstName?.charAt(0) || '?')}
                                                                    alt={`${familyMember.firstName} ${familyMember.lastName}`}
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/48x48/6B7280/FFFFFF?text=' + (familyMember.firstName?.charAt(0) || '?');
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="ml-4 min-w-0 flex-1">
                                                                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors duration-200">
                                                                    {familyMember.firstName} {familyMember.lastName}
                                                                </p>
                                                                {familyMember.phoneNumber && (
                                                                    <p className="text-xs text-gray-500 truncate">
                                                                        {familyMember.phoneNumber}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Details;
