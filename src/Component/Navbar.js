import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserThunk } from '../features/user/userSlice';
import SearchResults from './SearchResults';
import { LogOut, UserRound, Menu, X, Phone, Home } from 'lucide-react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.data);

    useEffect(() => {
        if (!userData && localStorage.getItem('authorization')) {
            dispatch(getUserThunk());
        }
    }, [dispatch, userData]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        setMenuOpen(false);
    };

    // Check if user is on profile page
    const isOnProfilePage = location.pathname === '/profile';
    // Check if user is on home page (root path)
    const isOnHomePage = location.pathname === '/';

    return (
        <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-xl shadow-medium">
                            <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-xl font-bold text-gray-900">Taran Contact</h1>
                            <p className="text-xs text-gray-500 -mt-1">Directory</p>
                        </div>
                        <div className="sm:hidden">
                            <h1 className="text-lg font-bold text-gray-900">TCD</h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="relative">
                            <SearchResults />
                        </div>
                        
                        {!localStorage.getItem('authorization') ? (
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-medium hover:shadow-lg"
                            >
                                Sign In
                            </button>
                        ) : (
                            <div className="flex items-center space-x-3">
                                {/* Show Home button when on profile page, Profile button when on home page */}
                                {isOnProfilePage ? (
                                    <button
                                        onClick={() => navigate('/')}
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        title="Home"
                                    >
                                        <Home className="w-5 h-5" />
                                    </button>
                                ) : isOnHomePage ? (
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        title="Profile"
                                    >
                                        <UserRound className="w-5 h-5" />
                                    </button>
                                ) : (
                                    // Show both buttons when on other pages
                                    <>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                            title="Home"
                                        >
                                            <Home className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                            title="Profile"
                                        >
                                            <UserRound className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-200"
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
                <div className="md:hidden animate-slide-up">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100 shadow-lg">
                        <div className="px-3 py-2">
                            <SearchResults />
                        </div>
                        
                        {!localStorage.getItem('authorization') ? (
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    setMenuOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            >
                                Sign In
                            </button>
                        ) : (
                            <>
                                {/* Show Home button when on profile page, Profile button when on home page */}
                                {isOnProfilePage ? (
                                    <button
                                        onClick={() => {
                                            navigate('/');
                                            setMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center"
                                    >
                                        <Home className="w-5 h-5 mr-3" />
                                        Home
                                    </button>
                                ) : isOnHomePage ? (
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center"
                                    >
                                        <UserRound className="w-5 h-5 mr-3" />
                                        Profile
                                    </button>
                                ) : (
                                    // Show both buttons when on other pages
                                    <>
                                        <button
                                            onClick={() => {
                                                navigate('/');
                                                setMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center"
                                        >
                                            <Home className="w-5 h-5 mr-3" />
                                            Home
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center"
                                        >
                                            <UserRound className="w-5 h-5 mr-3" />
                                            Profile
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 flex items-center"
                                >
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
