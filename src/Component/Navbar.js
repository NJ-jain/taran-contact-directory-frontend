import React from 'react'
import { useNavigate } from 'react-router-dom'
import SearchResults from './SearchResults'

const Navbar = () => {
    const navigate = useNavigate()

    
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">daisyUI</a>
            </div>
            <div className="flex-none gap-2">
                <div className="form-control">
                    <SearchResults />
                </div>
                {localStorage.getItem('authorization') ? <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li onClick={() => navigate("/profile")}>
                            <a className="justify-between">
                                Profile
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li onClick={() => {
                            localStorage.clear(); // Clear the localStorage
                            navigate("/login"); // Navigate to the login page
                        }}>
                            <a>Logout</a>
                        </li>
                    </ul>
                </div> : 
                <button className="btn" onClick={()=>  navigate("/login")}>Login</button>
                }
            </div>
           

        </div>
    )
}

export default Navbar