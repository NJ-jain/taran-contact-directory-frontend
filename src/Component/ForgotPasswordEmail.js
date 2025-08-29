import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordThunk, clearForgotPasswordState } from '../features/auth/authSlice';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';

const ForgotPasswordEmail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, forgotPasswordSuccess } = useSelector((state) => state.auth);
    
    const [email, setEmail] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);

    // Clear state when component mounts
    useEffect(() => {
        dispatch(clearForgotPasswordState());
    }, [dispatch]);

    // Handle successful email submission
    useEffect(() => {
        if (forgotPasswordSuccess) {
            // Navigate to OTP page with email as state
            navigate('/forgot-password-otp', { state: { email } });
            dispatch(clearForgotPasswordState());
        }
    }, [forgotPasswordSuccess, navigate, dispatch, email]);

    // Timer effect for resend OTP
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPasswordThunk(email));
        setCanResend(false);
        setResendTimer(120); // 2 minutes = 120 seconds
    };

    const goBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center shadow-medium">
                        <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email to receive a reset code
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-8">
                    <form className="space-y-6" onSubmit={handleEmailSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error.message}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !canResend}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-medium hover:shadow-lg"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Sending OTP...
                                </div>
                            ) : !canResend ? (
                                <div className="flex items-center">
                                    Wait {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    Send Reset Code
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={goBackToLogin}
                            className="flex items-center justify-center mx-auto text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;
