import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllMembersThunk } from '../features/member/memberSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Avatar from './Avatar';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Search, 
  Grid3X3, 
  List, 
  User, 
  Crown, 
  CheckCircle2, 
  ArrowRight, 
  X,
  Filter,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const CATEGORY_LABELS = {
  ashoka_garden: 'Ashoka Garden 🌳',
  kolar: 'Kolar 🏞️',
  mandideep: 'Mandideep 🏭',
  pansheel_nagar: 'Pansheel Nagar 🏘️',
  mangalvara: 'Mangalvara 🕌',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Dashboard = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector((state) => state.member);
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('taran_contact_view_mode') || 'grid';
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('taran_contact_view_mode', mode);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('search');
    if (queryParam) {
      setSearchTerm(queryParam);
    } else {
      dispatch(getAllMembersThunk());
    }
  }, [dispatch, location.search]);

  // Available categories in data
  const availableCategories = useMemo(() => {
    if (!members) return [];
    const cats = new Set();
    members.forEach((m) => {
      const cat = m.userId?.category;
      if (cat) cats.add(cat);
    });
    return Array.from(cats);
  }, [members]);

  // Letters that actually have contacts
  const availableLetters = useMemo(() => {
    if (!members) return new Set();
    const letters = new Set();
    members.forEach((m) => {
      const char = m.firstName?.charAt(0)?.toUpperCase();
      if (char) letters.add(char);
    });
    return letters;
  }, [members]);

  // Filtered members based on search term, alphabet, and category
  const filteredMembers = useMemo(() => {
    if (!Array.isArray(members)) return [];

    return members.filter((member) => {
      // 1. Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const fullName = `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase();
        const phone = (member.phoneNumber || '').toLowerCase();
        const email = (member.email || '').toLowerCase();
        const address = (member.address || '').toLowerCase();
        const cat = (member.userId?.category || '').toLowerCase();
        const matches = 
          fullName.includes(query) ||
          phone.includes(query) ||
          email.includes(query) ||
          address.includes(query) ||
          cat.includes(query);
        if (!matches) return false;
      }

      // 2. Letter filter
      if (selectedLetter !== 'ALL') {
        const firstLetter = member.firstName?.charAt(0)?.toUpperCase();
        if (firstLetter !== selectedLetter) return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'ALL') {
        const memberCat = member.userId?.category;
        if (memberCat !== selectedCategory) return false;
      }

      return true;
    });
  }, [members, searchTerm, selectedLetter, selectedCategory]);

  // Group members by first letter for list view or structured view
  const groupedMembers = useMemo(() => {
    const groups = {};
    filteredMembers.forEach((member) => {
      const letter = member.firstName?.charAt(0)?.toUpperCase() || '#';
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(member);
    });
    return groups;
  }, [filteredMembers]);

  const sortedLetters = useMemo(() => {
    return Object.keys(groupedMembers).sort();
  }, [groupedMembers]);

  const handleDetailsClick = (id) => {
    navigate(`/details/${id}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLetter('ALL');
    setSelectedCategory('ALL');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/60 pb-16">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-600 border-t-transparent"></div>
              <p className="mt-3 text-gray-700 font-medium text-sm">Loading contacts...</p>
            </div>
          </div>
        )}

        {/* Hero / Header Section */}
        <div className="bg-white border-b border-gray-200/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    Directory
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                    {filteredMembers.length} {filteredMembers.length === 1 ? 'contact' : 'contacts'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Browse and connect with verified community members
                </p>
              </div>

              {/* View Switcher & Action Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => dispatch(getAllMembersThunk())}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                  title="Refresh contacts"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>

                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-xs font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 className="w-3.5 h-3.5 mr-1.5" />
                    Grid
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-xs font-semibold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5 mr-1.5" />
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Category Filter Bar */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, phone, email, address..."
                  className="block w-full pl-10 pr-9 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              {availableCategories.length > 0 && (
                <div className="sm:w-56">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full py-2.5 px-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all"
                  >
                    <option value="ALL">All Areas / Categories</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat] || cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Alphabetical Quick-Jump Bar */}
            <div className="mt-4 pt-3 border-t border-gray-100 overflow-x-auto no-scrollbar">
              <div className="flex items-center space-x-1 min-w-max py-1">
                <button
                  onClick={() => setSelectedLetter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedLetter === 'ALL'
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                {ALPHABET.map((letter) => {
                  const hasContacts = availableLetters.has(letter);
                  const isSelected = selectedLetter === letter;
                  return (
                    <button
                      key={letter}
                      disabled={!hasContacts}
                      onClick={() => setSelectedLetter(letter)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-primary-600 text-white shadow-xs'
                          : hasContacts
                          ? 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                <X className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-800">Unable to load contacts</h3>
                <p className="text-xs text-red-600 mt-0.5">{error.message || String(error)}</p>
              </div>
            </div>
          )}

          {/* Active Filter Indicators */}
          {(selectedLetter !== 'ALL' || selectedCategory !== 'ALL' || searchTerm) && (
            <div className="mb-5 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-gray-500 font-medium">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-700">
                    Query: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1.5 text-gray-400 hover:text-gray-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedLetter !== 'ALL' && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-700">
                    Letter: {selectedLetter}
                    <button onClick={() => setSelectedLetter('ALL')} className="ml-1.5 text-gray-400 hover:text-gray-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'ALL' && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-700">
                    Area: {CATEGORY_LABELS[selectedCategory] || selectedCategory}
                    <button onClick={() => setSelectedCategory('ALL')} className="ml-1.5 text-gray-400 hover:text-gray-600">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Contacts Container */}
          {filteredMembers.length > 0 ? (
            viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredMembers.map((member) => {
                  const category = member.userId?.category;
                  return (
                    <div
                      key={member._id}
                      onClick={() => handleDetailsClick(member._id)}
                      className="group bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-primary-200 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-5">
                        {/* Card Top: Avatar and Badges */}
                        <div className="flex items-start justify-between">
                          <Avatar
                            src={member.dp}
                            firstName={member.firstName}
                            lastName={member.lastName}
                            size="lg"
                            className="ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform"
                          />

                          <div className="flex flex-col items-end space-y-1">
                            {member.familyHead && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                                title="Family Head"
                              >
                                <Crown className="w-3 h-3 mr-1 text-amber-500 fill-amber-400" />
                                Head
                              </span>
                            )}
                            {member.isApproved && (
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                                title="Verified Directory Member"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600" />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Name & Details */}
                        <div className="mt-3.5">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                            {member.firstName} {member.lastName}
                          </h3>

                          {category && (
                            <span className="inline-block mt-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                              {CATEGORY_LABELS[category] || category}
                            </span>
                          )}

                          <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                            {member.phoneNumber && (
                              <div className="flex items-center truncate">
                                <Phone className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{member.phoneNumber}</span>
                              </div>
                            )}

                            {member.email && (
                              <div className="flex items-center truncate">
                                <Mail className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{member.email}</span>
                              </div>
                            )}

                            {member.address && (
                              <div className="flex items-center truncate">
                                <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                                <span className="truncate capitalize">{member.address}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Quick Action Buttons */}
                      <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {member.phoneNumber && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${member.phoneNumber}`, '_self');
                              }}
                              className="p-1.5 rounded-lg bg-white border border-gray-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-2xs"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {member.email && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${member.email}`, '_self');
                              }}
                              className="p-1.5 rounded-lg bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-2xs"
                              title="Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <span className="inline-flex items-center text-xs font-semibold text-primary-600 group-hover:translate-x-0.5 transition-transform">
                          Details
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                {sortedLetters.map((letter) => (
                  <div key={letter}>
                    {/* Alphabet Section Header */}
                    <div className="sticky top-16 bg-gray-50/95 backdrop-blur-xs px-5 py-2.5 border-b border-gray-200/60 z-10 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 tracking-wider">
                        {letter}
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {groupedMembers[letter].length} contacts
                      </span>
                    </div>

                    {/* Member rows */}
                    <div className="divide-y divide-gray-100">
                      {groupedMembers[letter]
                        .sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''))
                        .map((member) => (
                          <div
                            key={member._id}
                            onClick={() => handleDetailsClick(member._id)}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                              <Avatar
                                src={member.dp}
                                firstName={member.firstName}
                                lastName={member.lastName}
                                size="sm"
                              />

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                    {member.firstName} {member.lastName}
                                  </h4>

                                  {member.familyHead && (
                                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                      <Crown className="w-2.5 h-2.5 mr-0.5 text-amber-500 fill-amber-400" />
                                      Head
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
                                  {member.phoneNumber && (
                                    <span className="truncate">{member.phoneNumber}</span>
                                  )}
                                  {member.email && (
                                    <span className="hidden sm:inline-block truncate text-gray-400">
                                      • {member.email}
                                    </span>
                                  )}
                                  {member.address && (
                                    <span className="hidden md:inline-block truncate text-gray-400">
                                      • {member.address}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center space-x-2 ml-4">
                              {member.phoneNumber && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`tel:${member.phoneNumber}`, '_self');
                                  }}
                                  className="p-1.5 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 transition-colors"
                                  title="Call"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {member.email && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`mailto:${member.email}`, '_self');
                                  }}
                                  className="p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                                  title="Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            !loading && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center shadow-xs">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900">No contacts found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  {searchTerm || selectedLetter !== 'ALL' || selectedCategory !== 'ALL'
                    ? 'No directory contacts match your current filter criteria.'
                    : 'The directory currently has no verified contacts.'}
                </p>
                {(searchTerm || selectedLetter !== 'ALL' || selectedCategory !== 'ALL') && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-semibold hover:bg-primary-100 transition-colors"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
