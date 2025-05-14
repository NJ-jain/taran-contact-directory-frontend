import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMembersThunk } from '../features/member/memberSlice';
import { useLocation, useNavigate } from 'react-router-dom';

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
        if (searchQuery.trim()) { // Only trigger search when query is not empty
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
            <input
                type="text"
                placeholder="Search"
                className="input input-bordered lg:w-52 xl:w-52 2xl:w-52 md:w-auto w-72 xs:w-[21rem] nj:w-[24.5rem] "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
            />
            {isInputFocused && location.pathname !== '/' && members.length > 0 && (
                <div className="absolute top-[50px]  lg:w-52 xl:w-52 2xl:w-52 md:w-auto w-72 xs:w-[21rem] right-0 z-50 bg-white rounded-xl shadow-lg">
                    <ul className='md:w-56'>
                        {members.slice(0, 10).map((data) => (
                            <li
                                key={data.id}
                                className="flex items-center cursor-pointer hover:bg-base-300 p-2 border-b space-x-3"
                                onClick={() => navigate(`/details/${data._id}`)}
                            >
                                <img src={data.dp} alt={data.firstName} className="w-10 h-10 rounded-full" />
                                <span>{data.firstName} {data.lastName}</span>
                            </li>
                        ))}
                        {members.length > 10 && (
                            <li className="flex items-center cursor-pointer hover:bg-base-300 p-2 border-b space-x-3">
                                <button className="btn-sm btn">Show More</button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
