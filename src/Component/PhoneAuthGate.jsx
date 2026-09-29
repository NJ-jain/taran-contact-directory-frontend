import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPhoneOtpThunk, verifyPhoneOtpThunk, resetPhoneOtpState } from '../features/auth/authSlice';
import { 
  ShieldCheck, 
  Phone, 
  ArrowRight, 
  KeyRound, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';

const PhoneAuthGate = ({ onSuccess, title = "Community Directory Access", subtitle = "Access is restricted to verified community members" }) => {
  const dispatch = useDispatch();
  const { loading, error, phoneOtpSent, phoneOtpData } = useSelector((state) => state.auth);

  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [verifiedMemberName, setVerifiedMemberName] = useState('');
  const [localError, setLocalError] = useState('');

  const inputRefs = useRef([]);

  // Sync step with Redux state
  useEffect(() => {
    if (phoneOtpSent && step === 'phone') {
      setStep('otp');
      setCountdown(60);
      setLocalError('');
      // Auto focus first OTP input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [phoneOtpSent, step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (rawVal.length <= 10) {
      setPhoneNumber(rawVal);
      setLocalError('');
    }
  };

  // Submit phone number to check if it exists in directory
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setLocalError('');

    const cleanNumber = phoneNumber.trim();
    if (cleanNumber.length !== 10) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const result = await dispatch(sendPhoneOtpThunk(cleanNumber));
    if (sendPhoneOtpThunk.rejected.match(result)) {
      const errMsg = result.payload?.message || 'Failed to send OTP. Please try again.';
      setLocalError(errMsg);
    }
  };

  // Handle single digit input
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setLocalError('');

    // Advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation in OTP
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste in OTP input
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setOtpDigits(newDigits);

    // Focus last filled or next input
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Autofill dev OTP
  const handleAutofillDevOtp = () => {
    if (phoneOtpData?.devOtp) {
      const code = phoneOtpData.devOtp.toString();
      const newDigits = code.split('').slice(0, 6);
      setOtpDigits(newDigits);
      setLocalError('');
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  // Verify OTP code
  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    setLocalError('');

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setLocalError('Please enter all 6 digits of the OTP.');
      return;
    }

    const result = await dispatch(verifyPhoneOtpThunk({
      phoneNumber,
      otp: fullOtp
    }));

    if (verifyPhoneOtpThunk.fulfilled.match(result)) {
      const payload = result.payload;
      const member = payload.member;
      const name = member ? `${member.firstName} ${member.lastName}`.trim() : 'Member';
      setVerifiedMemberName(name);
      setStep('success');

      // Brief animation before unlocking
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(payload);
        }
      }, 1000);
    } else {
      const errMsg = result.payload?.message || 'Invalid or expired OTP. Please try again.';
      setLocalError(errMsg);
    }
  };

  // Change phone number (go back)
  const handleChangeNumber = () => {
    dispatch(resetPhoneOtpState());
    setStep('phone');
    setOtpDigits(['', '', '', '', '', '']);
    setLocalError('');
  };

  const displayError = localError || (error?.message ? error.message : null);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-soft border border-gray-100/80 overflow-hidden transition-all duration-300">
        
        {/* Top Header Badge */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 px-6 py-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner mb-3 border border-white/30">
              {step === 'success' ? (
                <CheckCircle2 className="w-8 h-8 text-white animate-bounce" />
              ) : step === 'otp' ? (
                <KeyRound className="w-8 h-8 text-white" />
              ) : (
                <Lock className="w-8 h-8 text-white" />
              )}
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-2 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Verified Community Directory</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              {title}
            </h2>
            <p className="text-sm text-primary-100 max-w-xs mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          
          {/* STEP 1: Phone Input */}
          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Enter Your Registered Phone Number
                </label>
                <div className="relative flex items-center rounded-2xl border-2 border-gray-200 focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-100 transition-all bg-white overflow-hidden shadow-xs">
                  {/* Country Prefix */}
                  <div className="flex items-center space-x-1.5 px-3.5 py-3.5 bg-gray-50/90 border-r border-gray-200 text-gray-700 font-semibold text-sm select-none">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                  </div>

                  {/* Input Field */}
                  <input
                    id="phone-login-input"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    maxLength={10}
                    autoFocus
                    className="w-full px-4 py-3.5 text-gray-900 text-base font-semibold tracking-wide placeholder-gray-400 focus:outline-none bg-transparent"
                  />

                  {phoneNumber.length === 10 && (
                    <div className="pr-3.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>

                <p className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                  <span>ℹ️</span>
                  <span>Enter the 10-digit number registered in the community directory.</span>
                </p>
              </div>

              {/* Error Alert */}
              {displayError && (
                <div className="rounded-2xl bg-red-50 border border-red-200/80 p-4 text-sm text-red-700 flex items-start space-x-3 animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800">Access Restricted</p>
                    <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{displayError}</p>
                    {displayError.toLowerCase().includes('not registered') && (
                      <p className="text-[11px] text-red-600 mt-2 font-medium bg-red-100/60 p-2 rounded-lg border border-red-200">
                        Need access? Please contact the directory coordinator or community admin to add your number to the approved members list.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 group active:scale-[0.99]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying in directory...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-gray-400">
                  Secured with 256-bit encrypted authentication • No public access
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Change Number</span>
                </button>
                <span className="text-xs font-semibold text-gray-500">
                  +91 {phoneNumber.slice(0, 5)} {phoneNumber.slice(5)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <p className="text-xs text-gray-500 text-center mb-4">
                  We've sent a 6-digit OTP code to your registered mobile number.
                </p>

                {/* 6 Segmented OTP Inputs */}
                <div className="flex justify-center items-center space-x-2 sm:space-x-3" onPaste={handlePaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all focus:outline-none select-none ${
                        digit
                          ? 'border-primary-500 bg-primary-50/40 text-primary-900 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Dev Mode OTP Quick Autofill Badge */}
              {phoneOtpData?.devOtp && (
                <div 
                  onClick={handleAutofillDevOtp}
                  className="mx-auto cursor-pointer max-w-xs p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between hover:bg-amber-100 transition-colors"
                  title="Click to fill automatically"
                >
                  <div className="flex items-center space-x-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dev OTP: <strong className="font-mono text-sm tracking-wider">{phoneOtpData.devOtp}</strong></span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 underline">Tap to autofill</span>
                </div>
              )}

              {/* Error Message */}
              {displayError && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 flex items-center space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{displayError}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="w-full inline-flex items-center justify-center px-6 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-200 group active:scale-[0.99]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Verify & Unlock Directory</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center pt-1">
                {countdown > 0 ? (
                  <p className="text-xs text-gray-400">
                    Resend code in <span className="font-semibold text-gray-600 font-mono">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                )}
              </div>

            </form>
          )}

          {/* STEP 3: Verification Success */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-soft">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Welcome back{verifiedMemberName ? `, ${verifiedMemberName}` : ''}!
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Identity verified successfully. Loading community contacts...
                </p>
              </div>
              <div className="w-8 h-8 mx-auto border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin mt-4" />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PhoneAuthGate;
