import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMembersThunk } from '../features/member/memberSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User } from 'lucide-react';

const SearchResults = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const members = useSelector((state) => state.member.members);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const ref = useRef(null);

    // Debounce logic to reduce API calls
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    // Handle search dispatch with debouncing
    const debouncedSearch = useCallback(
        debounce((query) => {
            if (query) {
                dispatch(searchMembersThunk(query));
                navigate(`?search=${encodeURIComponent(query)}`, { replace: true });
            } else {
                dispatch(searchMembersThunk(''));
                navigate('.', { replace: true });
            }
        }, 500),
        [dispatch, navigate]
    );

    // Effect to read URL query parameters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryParam = searchParams.get('search') || '';
        setSearchQuery(queryParam);
    }, [location.search]);

    // Effect to debounce the API call
    useEffect(() => {
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        }
    }, [searchQuery, debouncedSearch]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsInputFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search contacts..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                />
            </div>
            
            {isInputFocused && location.pathname !== '/' && members.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-medium border border-gray-200 z-50 animate-fade-in">
                    <div className="py-2">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Search Results
                        </div>
                        <ul className="max-h-64 overflow-y-auto">
                            {members.slice(0, 8).map((data) => (
                                <li
                                    key={data.id}
                                    className="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-2 transition-colors duration-150"
                                    onClick={() => {
                                        navigate(`/details/${data._id}`);
                                        setIsInputFocused(false);
                                    }}
                                >
                                    <div className="flex-shrink-0">
                                        <img 
                                            src={data.dp} 
                                            alt={data.firstName} 
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/32x32/6B7280/FFFFFF?text=' + (data.firstName?.charAt(0) || '?');
                                            }}
                                        />
                                    </div>
                                    <div className="ml-3 min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {data.firstName} {data.lastName}
                                        </p>
                                        {data.phoneNumber && (
                                            <p className="text-xs text-gray-500 truncate">
                                                {data.phoneNumber}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        {members.length > 8 && (
                            <div className="border-t border-gray-100 px-3 py-2">
                                <button 
                                    className="w-full text-left text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    onClick={() => {
                                        navigate('/');
                                        setIsInputFocused(false);
                                    }}
                                >
                                    View all {members.length} results
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
