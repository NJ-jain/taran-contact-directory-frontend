import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserThunk } from '../features/user/userSlice';
import SearchResults from './SearchResults';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false); // State for controlling the menu
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.data);

    useEffect(() => {
        if (!userData && localStorage.getItem('authorization')) {
            dispatch(getUserThunk());
        }
    }, [dispatch, userData]);

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo and Title */}
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span style={{ fontSize: "x-large" }}>☎️</span>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        TCD
                    </span>
                </a>

                {/* Navbar right items: Search and User Authentication */}
                <div className="flex ">
                    {/* Hamburger Icon for Mobile */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)} // Toggle menu visibility
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-expanded={menuOpen ? "true" : "false"}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>

                    {/* Search for larger screens */}
                    {/* <div className="relative hidden md:block">
                        <SearchResults />
                    </div> */}
                </div>

                {/* Dropdown Menu for Mobile */}
                {menuOpen && (
                    <div
                        className="absolute top-16 left-0 w-full bg-white border border-gray-100 rounded-lg shadow-lg p-4 md:hidden z-50"
                        id="navbar-search"
                    >
                        <ul className="flex flex-col space-y-4">
                            {!localStorage.getItem('authorization') ? (
                                <li>
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                        }}
                                        className="btn btn-block"
                                    >
                                        Login
                                    </button>
                                </li>
                            ) : (
                                <>

                                    <li>
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="btn btn-block"
                                        >
                                            Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => {
                                                localStorage.clear();
                                                navigate('/login');
                                            }}
                                            className="btn btn-block"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}

                {/* Navbar Links */}
                <div
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                    id="navbar-search"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {!localStorage.getItem('authorization') ? (
                            <div className='flex justify-center items-center gap-8'>
                                <li>
                                    <SearchResults />
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                        }}
                                        // href="#"
                                        className="btn"
                                    >
                                        Login
                                    </button>
                                </li>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center gap-8'>
                                <li>
                                    <SearchResults />

                                </li>
                                <li>
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="btn "
                                        aria-current="page"
                                    >
                                        Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            navigate('/login');
                                        }}
                                        className="btn" >
                                        Logout
                                    </button>
                                </li>
                            </div>


                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
