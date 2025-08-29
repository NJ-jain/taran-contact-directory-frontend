import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { forgotPasswordThunk, resetPasswordThunk, clearForgotPasswordState, clearResetPasswordState } from '../features/auth/authSlice';
import { Lock, ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

const ForgotPasswordOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading, error, resetPasswordSuccess } = useSelector((state) => state.auth);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);
    
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Get email from navigation state
    const email = location.state?.email;

    // Redirect if no email is provided
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    // Clear state when component mounts
    useEffect(() => {
        dispatch(clearForgotPasswordState());
        dispatch(clearResetPasswordState());
    }, [dispatch]);

    // Handle successful password reset
    useEffect(() => {
        if (resetPasswordSuccess) {
            // Redirect to login after successful password reset
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    }, [resetPasswordSuccess, navigate]);

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

    const handleResetPassword = (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            return;
        }
        
        const resetData = {
            email,
            otp,
            newPassword
        };
        
        dispatch(resetPasswordThunk(resetData));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const goBackToEmail = () => {
        navigate('/forgot-password');
    };

    const resendOTP = () => {
        if (!canResend || !email) return;
        
        dispatch(forgotPasswordThunk(email));
        setCanResend(false);
        setResendTimer(120); // 2 minutes = 120 seconds
    };

    // If no email, show loading or redirect
    if (!email) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center shadow-medium">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter the OTP sent to your email and your new password
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-8">
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        {/* Email Display */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">
                                OTP sent to: <span className="font-medium text-gray-900">{email}</span>
                            </p>
                        </div>

                        {/* OTP Input */}
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter OTP
                            </label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="block w-full px-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-center text-lg font-mono"
                                placeholder="000000"
                                maxLength="6"
                            />
                        </div>

                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Mismatch Error */}
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-700">Passwords do not match</p>
                            </div>
                        )}

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

                        {/* Success Message */}
                        {resetPasswordSuccess && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-green-700">Password reset successfully! Redirecting to login...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || newPassword !== confirmPassword || !newPassword || !confirmPassword}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-medium hover:shadow-lg"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Resetting Password...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    Reset Password
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                            )}
                        </button>

                        {/* Resend OTP */}
                        <div className="text-center">
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={resendOTP}
                                    disabled={loading}
                                    className="text-sm text-primary-600 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Didn't receive the code? Resend
                                </button>
                            ) : (
                                <div className="text-sm text-gray-500">
                                    Resend available in {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* Back to Email */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={goBackToEmail}
                            className="flex items-center justify-center mx-auto text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordOTP;
