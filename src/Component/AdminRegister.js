import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdminThunk } from '../features/auth/authSlice';

const AdminRegister = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        aboutUs: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerAdminThunk(formData)).then((result) => {
            if (registerAdminThunk.fulfilled.match(result)) {
                navigate('/admin');
            }
        });
    };

    return (
        <div className="bg-sky-100 flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
                <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4">Admin Registration</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 bg-sky-100">
                        <label htmlFor="email" className="block text-gray-600">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
                            autoComplete="off" 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-800">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
                            autoComplete="off" 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="aboutUs" className="block text-gray-800">About</label>
                        <textarea
                            id="aboutUs"
                            name="aboutUs"
                            value={formData.aboutUs}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                            rows="4"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-md py-2 px-4 w-full" 
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register as Admin'}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error?.message}</p>}
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">Already have an admin account?</p>
                    <p className="text-green-500 hover:underline cursor-pointer mt-2" onClick={() => navigate('/admin/login')}>
                        Login as Admin
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminRegister; 