import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { phoneLoginThunk } from '../features/auth/authSlice';
import { 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

const PhoneAuthGate = ({ 
  onSuccess, 
  title = "Community Directory Access", 
  subtitle = "Access is restricted to verified community members" 
}) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [step, setStep] = useState('phone'); // 'phone' | 'success'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifiedMemberName, setVerifiedMemberName] = useState('');
  const [localError, setLocalError] = useState('');

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (rawVal.length <= 10) {
      setPhoneNumber(rawVal);
      setLocalError('');
    }
  };

  // Submit phone number to log in directly
  const handlePhoneLogin = async (e) => {
    if (e) e.preventDefault();
    setLocalError('');

    const cleanNumber = phoneNumber.trim();
    if (cleanNumber.length !== 10) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const result = await dispatch(phoneLoginThunk({ phoneNumber: cleanNumber }));

    if (phoneLoginThunk.fulfilled.match(result)) {
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
      }, 900);
    } else {
      const errMsg = result.payload?.message || 'Phone number not found or inactive. Please try again.';
      setLocalError(errMsg);
    }
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
          
          {/* STEP 1: Direct Phone Input */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneLogin} className="space-y-6">
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
                  <span>Enter the 10-digit mobile number registered in the community directory.</span>
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
                    <span>Access Directory</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-gray-400">
                  Secured with encrypted authentication • No public access
                </p>
              </div>
            </form>
          )}

          {/* STEP 2: Verification Success */}
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
