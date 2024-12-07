import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUserThunk } from '../features/auth/authSlice';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    // Add a new state variable for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);

    // ... existing handleChange and handleSubmit ...

    // Add a new function to toggle the password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUserThunk(formData)).then((result) => {
            if (loginUserThunk.fulfilled.match(result)) {
                navigate('/profile'); // Redirect to a dashboard or home page after successful login
            }
            else {
                navigate("/login")
            }
        });
    };

    return (
        <div className="bg-sky-100 flex justify-center items-center h-screen">
            {/* Left: Image */}
            <div className="w-1/2 h-screen hidden lg:block">
                <img src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826" alt="Placeholder Image" className="object-cover w-full h-full" />
            </div>
            {/* Right: Login Form */}
            <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
                <h1 className="text-2xl font-semibold mb-4">Login</h1>
                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4 bg-sky-100">
                        <label htmlFor="email" className="block text-gray-600">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" autoComplete="off" />
                    </div>
                    {/* Password Input */}
                    <div className="mb-4 relative"> 
                        <label htmlFor="password" className="block text-gray-800">Password</label>
                        <input
                            type={showPassword ? "text" : "password"} 
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:border-blue-500" 
                            autoComplete="off"
                        />
                        <button
                            type="button" 
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" 
                            style={{top: "50%" , transform : "translate(0px, -3px)"}}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    {/* Remember Me Checkbox */}
                    <div className="mb-4 flex items-center">
                        <input type="checkbox" id="remember" name="remember" className="text-red-500" />
                        <label htmlFor="remember" className="text-green-900 ml-2">Remember Me</label>
                    </div>
                    {/* Forgot Password Link */}
                    <div className="mb-6 text-blue-500">
                        <a href="#" className="hover:underline">Forgot Password?</a>
                    </div>
                    {/* Login Button */}
                    <button type="submit" className="bg-red-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error.message}</p>}
                </form>
                {/* Sign up Link */}
                <div className="mt-6 text-green-500 text-center">
                    <p
                        className="hover:underline cursor-pointer"
                        onClick={() => navigate('/register')}
                    >
                        Sign up Here
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;