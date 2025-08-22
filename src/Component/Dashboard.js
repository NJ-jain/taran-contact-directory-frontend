import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllMembersThunk } from '../features/member/memberSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import SearchResults from './SearchResults';
import { Phone, Mail, MapPin, Calendar, Users, Search, Grid3X3, List } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector((state) => state.member);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('search');
    if (!queryParam || queryParam.trim() === '') dispatch(getAllMembersThunk());
  }, [dispatch, location.search]);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Filter members based on the search term
  const filteredMembers = members?.filter((member) => {
    const memberValues = Object.values(member).join(' ').toLowerCase();
    return memberValues.includes(searchTerm.toLowerCase());
  });

  const handleDetailsClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-3 text-gray-600 text-sm">Loading contacts...</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Contact Directory
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Find and connect with your contacts easily
              </p>
            </div>
            
            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-primary-600">Total Contacts</p>
                    <p className="text-2xl font-bold text-primary-900">{members?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and View Toggle */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Mobile Search */}
            <div className="w-full sm:hidden">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title="List View"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading contacts</h3>
                  <p className="mt-1 text-sm text-red-700">{error.message || 'An error occurred while loading contacts'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Contacts Display */}
          {filteredMembers?.length > 0 ? (
            viewMode === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member._id}
                    onClick={() => handleDetailsClick(member._id)}
                    className="bg-white rounded-lg shadow-soft border border-gray-100 hover:shadow-medium transition-all duration-200 cursor-pointer group"
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors duration-200"
                            src={member.dp || 'https://via.placeholder.com/64x64/6B7280/FFFFFF?text=' + (member.firstName?.charAt(0) || '?')}
                            alt={`${member.firstName} ${member.lastName}`}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64/6B7280/FFFFFF?text=' + (member.firstName?.charAt(0) || '?');
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
                            {member.firstName} {member.lastName}
                          </h3>
                          <div className="mt-2 space-y-1">
                            {member.phoneNumber && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="truncate">{member.phoneNumber}</span>
                              </div>
                            )}
                            {member.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="truncate">{member.email}</span>
                              </div>
                            )}
                            {member.address && (
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="truncate">{member.address}</span>
                              </div>
                            )}
                            {member.dob && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="truncate">{member.dob}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="bg-white rounded-lg shadow-soft border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <div
                      key={member._id}
                      onClick={() => handleDetailsClick(member._id)}
                      className="flex items-center p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                    >
                      <div className="flex-shrink-0">
                        <img
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors duration-200"
                          src={member.dp || 'https://via.placeholder.com/64x64/6B7280/FFFFFF?text=' + (member.firstName?.charAt(0) || '?')}
                          alt={`${member.firstName} ${member.lastName}`}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64/6B7280/FFFFFF?text=' + (member.firstName?.charAt(0) || '?');
                          }}
                        />
                      </div>
                      <div className="ml-6 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
                              {member.firstName} {member.lastName}
                            </h3>
                            <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                              {member.phoneNumber && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{member.phoneNumber}</span>
                                </div>
                              )}
                              {member.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{member.email}</span>
                                </div>
                              )}
                              {member.address && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{member.address}</span>
                                </div>
                              )}
                              {member.dob && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{member.dob}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-primary-400 transition-colors duration-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : !loading && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-300">
                <Users className="h-full w-full" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No contacts found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first contact.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
