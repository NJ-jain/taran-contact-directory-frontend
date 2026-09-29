import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMemberThunk, clearMemberDetails } from "../features/member/memberSlice";
import Navbar from "./Navbar";
import Avatar from "./Avatar";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  Crown, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Building
} from 'lucide-react';

const CATEGORY_LABELS = {
  ashoka_garden: 'Ashoka Garden 🌳',
  kolar: 'Kolar 🏞️',
  mandideep: 'Mandideep 🏭',
  pansheel_nagar: 'Pansheel Nagar 🏘️',
  mangalvara: 'Mangalvara 🕌',
};

const Details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const memberState = useSelector((state) => state.member.member);
  const loading = useSelector((state) => state.member.loading);
  const error = useSelector((state) => state.member.error);

  const [copiedField, setCopiedField] = useState(null);

  // Normalize member data structure
  const member = memberState?.member || memberState || {};

  useEffect(() => {
    if (id) {
      dispatch(getMemberThunk({ id }));
    }
    return () => {
      dispatch(clearMemberDetails());
    };
  }, [dispatch, id]);

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDateOfBirth = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const user = member?.userId || {};
  const familyMembers = (user?.membersArray || []).filter(
    (fm) => (fm._id || fm.id) !== id
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/60 pb-16">
        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-600 border-t-transparent"></div>
              <p className="mt-3 text-gray-700 font-medium text-sm">Loading contact profile...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto px-4 pt-12">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow-xs">
              <h3 className="text-base font-bold text-red-900">Contact Not Found</h3>
              <p className="text-sm text-red-700 mt-1">{error.message || String(error)}</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
              >
                Back to Directory
              </button>
            </div>
          </div>
        )}

        {member && member.firstName && (
          <>
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200/80">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center text-xs font-semibold text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back to Directory
                </button>

                <div className="flex items-center space-x-2">
                  {user.category && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                      <Building className="w-3 h-3 mr-1 text-gray-400" />
                      {CATEGORY_LABELS[user.category] || user.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hero / Banner Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-200/80 bg-white">
                {/* Banner Image or Gradient */}
                <div 
                  className="h-44 sm:h-56 md:h-64 w-full bg-cover bg-center relative"
                  style={{
                    backgroundImage: user.banner 
                      ? `url('${user.banner}')` 
                      : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
                </div>

                {/* Profile Header Details (Overlapping the banner) */}
                <div className="px-6 pb-6 pt-0 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar
                        src={member.dp}
                        firstName={member.firstName}
                        lastName={member.lastName}
                        size="2xl"
                        className="ring-4 ring-white shadow-xl"
                      />
                      {member.familyHead && (
                        <div 
                          className="absolute -top-1 -right-1 bg-amber-500 text-white p-2 rounded-full shadow-lg ring-2 ring-white"
                          title="Family Head"
                        >
                          <Crown className="w-4 h-4 fill-white" />
                        </div>
                      )}
                    </div>

                    {/* Quick Call / Email Action Bar */}
                    <div className="flex items-center space-x-2.5 pt-2 sm:pt-0">
                      {member.phoneNumber && (
                        <button
                          onClick={() => window.open(`tel:${member.phoneNumber}`, '_self')}
                          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                          <Phone className="w-3.5 h-3.5 mr-1.5" />
                          Call Now
                        </button>
                      )}
                      {member.email && (
                        <button
                          onClick={() => window.open(`mailto:${member.email}`, '_self')}
                          className="inline-flex items-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5" />
                          Send Email
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Name and Badges */}
                  <div className="mt-4">
                    <div className="flex items-center space-x-2.5 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        {member.firstName} {member.lastName}
                      </h1>
                      {member.isApproved && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                          Verified Member
                        </span>
                      )}
                      {member.familyHead && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Crown className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-400" />
                          Head of Family
                        </span>
                      )}
                    </div>

                    {user.aboutUs && (
                      <p className="mt-2 text-sm text-gray-600 max-w-2xl leading-relaxed">
                        "{user.aboutUs}"
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Information Cards Grid */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Phone Contact Card */}
                {member.phoneNumber && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Phone Number</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{member.phoneNumber}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(member.phoneNumber, 'phone')}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Copy phone number"
                    >
                      {copiedField === 'phone' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}

                {/* Email Contact Card */}
                {member.email && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Email Address</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate max-w-[200px] sm:max-w-xs">{member.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(member.email, 'email')}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Copy email address"
                    >
                      {copiedField === 'email' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}

                {/* Address Card */}
                {member.address && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Address / Location</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5 capitalize">{member.address}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(member.address, 'address')}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Copy address"
                    >
                      {copiedField === 'address' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}

                {/* Date of Birth Card */}
                {member.dob && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400">Date of Birth</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatDateOfBirth(member.dob)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Family Members Section */}
              {familyMembers.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-primary-600" />
                      <h2 className="text-lg font-bold text-gray-900">Family Members</h2>
                    </div>
                    <span className="text-xs font-medium text-gray-500">
                      {familyMembers.length} {familyMembers.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {familyMembers.map((fam) => (
                      <div
                        key={fam._id || fam.id}
                        onClick={() => navigate(`/details/${fam._id || fam.id}`)}
                        className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <Avatar
                            src={fam.dp}
                            firstName={fam.firstName}
                            lastName={fam.lastName}
                            size="md"
                            className="group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                {fam.firstName} {fam.lastName}
                              </h4>
                              {fam.familyHead && (
                                <Crown className="w-3 h-3 text-amber-500 fill-amber-400 flex-shrink-0" />
                              )}
                            </div>
                            {fam.phoneNumber && (
                              <p className="text-xs text-gray-400 truncate mt-0.5">
                                {fam.phoneNumber}
                              </p>
                            )}
                          </div>
                        </div>

                        <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-primary-600 transition-colors flex-shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Details;
