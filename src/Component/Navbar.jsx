import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserThunk, clearUserState } from '../features/user/userSlice';
import { logout } from '../features/auth/authSlice';
import SearchResults from './SearchResults';
import Avatar from './Avatar';
import { LogOut, UserRound, Menu, X, Users, Home } from 'lucide-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.data);
    const isAuthenticated = !!localStorage.getItem('authorization');

    useEffect(() => {
        if (!userData && isAuthenticated) {
            dispatch(getUserThunk());
        }
    }, [dispatch, userData, isAuthenticated]);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearUserState());
        navigate('/login');
        setMenuOpen(false);
    };

    const isOnProfilePage = location.pathname === '/profile';
    const isOnHomePage = location.pathname === '/';

    // Find primary member name if exists
    const primaryMember = userData?.membersArray?.[0];
    const userDisplayName = primaryMember
        ? `${primaryMember.firstName} ${primaryMember.lastName}`
        : userData?.email?.split('@')[0] || 'User';

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div 
                        onClick={() => navigate('/')} 
                        className="flex items-center space-x-3 cursor-pointer group select-none"
                    >
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-primary-600 via-primary-500 to-indigo-500 rounded-xl shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-200">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-1.5">
                                <h1 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                    Taran Directory
                                </h1>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-100">
                                    Community
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 hidden sm:block">Connecting Community Members</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-5">
                        <div className="relative w-64 lg:w-72">
                            <SearchResults />
                        </div>

                        {!isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                                >
                                    Register
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                {/* Navigation Links */}
                                <button
                                    onClick={() => navigate('/')}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        isOnHomePage
                                            ? 'bg-primary-50 text-primary-700 font-semibold'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <Home className="w-4 h-4 mr-1.5" />
                                    Directory
                                </button>

                                <button
                                    onClick={() => navigate('/profile')}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        isOnProfilePage
                                            ? 'bg-primary-50 text-primary-700 font-semibold'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <UserRound className="w-4 h-4 mr-1.5" />
                                    My Profile
                                </button>

                                {/* User Chip */}
                                <div 
                                    onClick={() => navigate('/profile')}
                                    className="flex items-center space-x-2.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer border border-gray-200/60 transition-colors"
                                    title="View Profile"
                                >
                                    <Avatar
                                        src={primaryMember?.dp}
                                        name={userDisplayName}
                                        size="xs"
                                    />
                                    <span className="text-xs font-semibold text-gray-800 max-w-[110px] truncate">
                                        {userDisplayName}
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-3 py-2 border border-gray-200 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4 mr-1.5" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-all duration-200"
                        >
                            <span className="sr-only">Open main menu</span>
                            {menuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden animate-slide-up border-t border-gray-100 bg-white shadow-xl">
                    <div className="px-4 pt-3 pb-4 space-y-2">
                        <div className="py-2">
                            <SearchResults />
                        </div>

                        {!isAuthenticated ? (
                            <div className="space-y-2 pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        navigate('/login');
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-center py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/register');
                                        setMenuOpen(false);
                                    }}
                                    className="w-full text-center py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl"
                                >
                                    Register
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl mb-3">
                                    <Avatar
                                        src={primaryMember?.dp}
                                        name={userDisplayName}
                                        size="sm"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{userDisplayName}</p>
                                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        navigate('/');
                                        setMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl flex items-center ${
                                        isOnHomePage ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Home className="w-4 h-4 mr-3" />
                                    Community Directory
                                </button>

                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-xl flex items-center ${
                                        isOnProfilePage ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <UserRound className="w-4 h-4 mr-3" />
                                    My Profile & Family
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl flex items-center transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
