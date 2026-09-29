import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerAdminThunk } from '../features/auth/authSlice';
import { ShieldCheck, Lock, Mail, User, KeyRound } from 'lucide-react';

const AdminRegister = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        adminSecretKey: ''
    });

    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setValidationError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            setValidationError('Please fill in all required fields');
            return;
        }
        if (formData.password.length < 8) {
            setValidationError('Password must be at least 8 characters');
            return;
        }

        dispatch(registerAdminThunk(formData)).then((result) => {
            if (registerAdminThunk.fulfilled.match(result)) {
                navigate('/admin');
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-purple-600/20 text-purple-400 rounded-xl">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Registration</h1>
                        <p className="text-xs text-slate-400">Authorized personnel only</p>
                    </div>
                </div>

                {validationError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
                        {validationError}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg">
                        {typeof error === 'string' ? error : error?.message || 'Registration failed'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">
                            Admin Username
                        </label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                value={formData.username} 
                                onChange={handleChange} 
                                required
                                placeholder="Admin Name"
                                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required
                                placeholder="admin@domain.com"
                                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                            Password (min 8 chars)
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required
                                placeholder="••••••••"
                                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="adminSecretKey" className="block text-sm font-medium text-slate-300 mb-1">
                            Registration Secret Key
                        </label>
                        <div className="relative">
                            <KeyRound className="w-5 h-5 absolute left-3 top-2.5 text-purple-400" />
                            <input 
                                type="password" 
                                id="adminSecretKey" 
                                name="adminSecretKey" 
                                value={formData.adminSecretKey} 
                                onChange={handleChange} 
                                placeholder="Enter system admin key"
                                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500" 
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Configured in backend as ADMIN_REGISTRATION_SECRET</p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-2.5 px-4 transition-all duration-150 disabled:opacity-50"
                    >
                        {loading ? 'Creating Admin Account...' : 'Register as Admin'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-700/60 pt-4">
                    <p className="text-sm text-slate-400">
                        Already have an admin account?{' '}
                        <button 
                            type="button"
                            onClick={() => navigate('/admin/login')}
                            className="text-purple-400 hover:text-purple-300 font-medium hover:underline"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;