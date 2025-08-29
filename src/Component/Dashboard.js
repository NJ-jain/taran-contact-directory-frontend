import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllMembersThunk } from '../features/member/memberSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import SearchResults from './SearchResults';
import { Phone, Mail, MapPin, Calendar, Users, Search, Grid3X3, List, User } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector((state) => state.member);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to format date of birth
  const formatDateOfBirth = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('search');
    if (!queryParam || queryParam.trim() === '') dispatch(getAllMembersThunk());
  }, [dispatch, location.search]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter members based on the search term
  const filteredMembers = members?.filter((member) => {
    const memberValues = Object.values(member).join(' ').toLowerCase();
    return memberValues.includes(searchTerm.toLowerCase());
  });

  const handleDetailsClick = (id) => {
    navigate(`/details/${id}`);
  };

  // Group members by first letter of first name
  const groupedMembers = filteredMembers?.reduce((groups, member) => {
    const firstLetter = member.firstName?.charAt(0)?.toUpperCase() || '#';
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(member);
    return groups;
  }, {});

  // Sort the groups alphabetically
  const sortedGroups = groupedMembers ? Object.keys(groupedMembers).sort() : [];

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
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Contacts
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {members?.length || 0} contacts
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search contacts..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Error State */}
          {error && (
            <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
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

          {/* Contacts List */}
          {filteredMembers?.length > 0 ? (
            <div className="bg-white">
              {sortedGroups.map((letter) => (
                <div key={letter}>
                  {/* Alphabetical Divider */}
                  <div className="sticky top-32 bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {letter}
                    </h2>
                  </div>
                  
                  {/* Contacts in this group */}
                  <div className="divide-y divide-gray-100">
                    {groupedMembers[letter]
                      .sort((a, b) => a.firstName.localeCompare(b.firstName))
                      .map((member) => (
                        <div
                          key={member._id}
                          onClick={() => handleDetailsClick(member._id)}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                        >
                          {/* Avatar */}
                          <div className="flex-shrink-0 mr-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {member.dp ? (
                                <img
                                  className="w-full h-full object-cover"
                                  src={member.dp}
                                  alt={`${member.firstName} ${member.lastName}`}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`w-full h-full flex items-center justify-center text-gray-600 font-semibold text-lg ${
                                  member.dp ? 'hidden' : 'flex'
                                }`}
                              >
                                {member.firstName?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-150 truncate">
                                  {member.firstName} {member.lastName}
                                </h3>
                                {member.phoneNumber && (
                                  <p className="text-sm text-gray-500 truncate mt-1">
                                    {member.phoneNumber}
                                  </p>
                                )}
                                {member.email && !member.phoneNumber && (
                                  <p className="text-sm text-gray-500 truncate mt-1">
                                    {member.email}
                                  </p>
                                )}
                              </div>
                              
                              {/* Quick Actions */}
                              <div className="flex items-center space-x-2 ml-3">
                                {member.phoneNumber && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`tel:${member.phoneNumber}`, '_self');
                                    }}
                                    className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-150"
                                    title="Call"
                                  >
                                    <Phone className="h-4 w-4" />
                                  </button>
                                )}
                                {member.email && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(`mailto:${member.email}`, '_self');
                                    }}
                                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-150"
                                    title="Email"
                                  >
                                    <Mail className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ) : !loading && (
            <div className="text-center py-16 px-4">
              <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
                <User className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
              <p className="text-gray-500">
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
