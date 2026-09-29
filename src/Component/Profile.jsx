import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approvalRequestThunk, getUserThunk, updateUserThunk } from "../features/user/userSlice";
import {
  CircleCheckBig,
  CirclePlus,
  Crown,
  Pencil,
  ImagePlus,
  ImageUp,
  X,
  Users,
  Building,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Save
} from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import {
  createMemberThunk,
  updateMemberThunk,
} from "../features/member/memberSlice";
import Navbar from "./Navbar";
import Avatar from "./Avatar";

const CATEGORY_OPTIONS = [
  { value: "ashoka_garden", label: "Ashoka Garden 🌳" },
  { value: "kolar", label: "Kolar 🏞️" },
  { value: "mandideep", label: "Mandideep 🏭" },
  { value: "pansheel_nagar", label: "Pansheel Nagar 🏘️" },
  { value: "mangalvara", label: "Mangalvara 🕌" },
];

const Profile = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const memberLoading = useSelector((state) => state.member.loading);

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [isEditingAboutUs, setIsEditingAboutUs] = useState(false);
  const [aboutUsText, setAboutUsText] = useState("");
  const [approvalRequested, setApprovalRequested] = useState(false);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [initialMemberState, setInitialMemberState] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(getUserThunk());
  }, [dispatch]);

  useEffect(() => {
    if (userData?.aboutUs) {
      setAboutUsText(userData.aboutUs);
    }
  }, [userData?.aboutUs]);

  // Format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch {
      return dateString;
    }
  };

  const handleImagePlusClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
      const updateData = { bannerImage: croppedImage };
      await dispatch(updateUserThunk(updateData));
      dispatch(getUserThunk());
      closeModal();
    } catch (err) {
      console.error("Failed to crop banner image", err);
    }
  };

  const handleAboutUsSave = async () => {
    await dispatch(updateUserThunk({ aboutUs: aboutUsText }));
    setIsEditingAboutUs(false);
  };

  const handleAddMemberClick = () => {
    setSelectedMember({
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phoneNumber: "",
      dob: "",
      familyHead: false,
      dp: null,
      dpFile: null,
    });
    setInitialMemberState(null);
    setFieldErrors({});
    setIsMemberModalOpen(true);
  };

  const handleEditMemberClick = (member) => {
    const formatted = {
      ...member,
      dob: formatDateForInput(member.dob),
    };
    setSelectedMember(formatted);
    setInitialMemberState(formatted);
    setFieldErrors({});
    setIsMemberModalOpen(true);
  };

  const closeMemberModal = () => {
    setIsMemberModalOpen(false);
    setSelectedMember(null);
    setFieldErrors({});
  };

  const validateFields = () => {
    const errors = {};
    if (!selectedMember?.firstName?.trim()) errors.firstName = "First name is required.";
    if (!selectedMember?.lastName?.trim()) errors.lastName = "Last name is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleMemberSave = async () => {
    if (!selectedMember) return;
    if (!validateFields()) return;

    const formData = new FormData();
    if (selectedMember.dpFile) formData.append("dp", selectedMember.dpFile);
    if (selectedMember.firstName) formData.append("firstName", selectedMember.firstName);
    if (selectedMember.lastName) formData.append("lastName", selectedMember.lastName);
    if (selectedMember.address !== undefined) formData.append("address", selectedMember.address);
    if (selectedMember.email !== undefined) formData.append("email", selectedMember.email);
    if (selectedMember.phoneNumber !== undefined) formData.append("phoneNumber", selectedMember.phoneNumber);
    if (selectedMember.dob !== undefined) formData.append("dob", selectedMember.dob);
    formData.append("familyHead", selectedMember.familyHead ? "true" : "false");

    await dispatch(
      updateMemberThunk({
        memberId: selectedMember._id,
        memberData: formData,
      })
    );
    dispatch(getUserThunk());
    closeMemberModal();
  };

  const handleMemberCreate = async () => {
    if (!validateFields()) return;

    const formData = new FormData();
    formData.append("firstName", selectedMember.firstName.trim());
    formData.append("lastName", selectedMember.lastName.trim());
    if (selectedMember.address) formData.append("address", selectedMember.address.trim());
    if (selectedMember.email) formData.append("email", selectedMember.email.trim());
    if (selectedMember.phoneNumber) formData.append("phoneNumber", selectedMember.phoneNumber.trim());
    if (selectedMember.dob) formData.append("dob", selectedMember.dob);
    formData.append("familyHead", selectedMember.familyHead ? "true" : "false");

    if (selectedMember.dpFile) {
      formData.append("dp", selectedMember.dpFile);
    }

    await dispatch(createMemberThunk({ memberData: formData }));
    dispatch(getUserThunk());
    closeMemberModal();
  };

  const handleRequestApproval = async () => {
    try {
      await dispatch(approvalRequestThunk()).unwrap();
      setApprovalRequested(true);
      setTimeout(() => setApprovalRequested(false), 5000);
    } catch (err) {
      console.error("Failed to request approval", err);
    }
  };

  const membersArray = userData?.membersArray || [];
  const hasUnapprovedMembers = membersArray.some((m) => !m.isApproved);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50/60 pb-20">
        {/* Loading Overlay */}
        {(loading || memberLoading) && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-600 border-t-transparent"></div>
              <p className="mt-3 text-gray-700 font-medium text-sm">Saving changes...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-5xl mx-auto px-4 pt-6">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
              Error: {error.message || String(error)}
            </div>
          </div>
        )}

        {userData && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Profile Hero Card */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
              {/* Banner Area */}
              <div
                className="relative h-48 sm:h-64 md:h-72 w-full bg-cover bg-center"
                style={{
                  backgroundImage: userData.banner
                    ? `url('${userData.banner}')`
                    : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)",
                }}
              >
                <div className="absolute inset-0 bg-black/25"></div>

                {/* Banner Change Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <button
                  onClick={handleImagePlusClick}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-md"
                  title="Change banner photo"
                >
                  <ImagePlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Change Banner</span>
                </button>

                {/* Category Pill Selector */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-md border border-white/50">
                  <select
                    className="bg-transparent text-xs font-bold text-gray-800 focus:outline-none px-2 py-1 cursor-pointer"
                    value={userData.category || ""}
                    onChange={(e) => {
                      const selectedCategory = e.target.value;
                      dispatch(updateUserThunk({ category: selectedCategory }));
                    }}
                  >
                    <option value="">Select Community Area</option>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Profile Meta & About Us */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      Family Account Profile
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                      Account email: <span className="font-semibold text-gray-800">{userData.email}</span>
                    </p>
                  </div>

                  {hasUnapprovedMembers && (
                    <div>
                      <button
                        onClick={handleRequestApproval}
                        disabled={approvalRequested}
                        className={`inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-all ${
                          approvalRequested
                            ? "bg-emerald-600"
                            : "bg-primary-600 hover:bg-primary-700"
                        }`}
                      >
                        {approvalRequested ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            Request Sent to Admin!
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-1.5" />
                            Request Admin Approval
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* About Us Section */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center">
                      About Our Family
                    </h3>
                    <button
                      onClick={() => setIsEditingAboutUs(!isEditingAboutUs)}
                      className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" />
                      {isEditingAboutUs ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {isEditingAboutUs ? (
                    <div className="space-y-3 mt-3">
                      <textarea
                        value={aboutUsText}
                        onChange={(e) => setAboutUsText(e.target.value)}
                        placeholder="Share a short bio or message about your family..."
                        className="w-full p-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        rows="3"
                      />
                      <button
                        onClick={handleAboutUsSave}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                      >
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        Save About Us
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
                      {userData.aboutUs || "No family bio provided yet. Click edit to add a message."}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Family Members Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-bold text-gray-900">Family Members</h3>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {membersArray.length}
                  </span>
                </div>

                <button
                  onClick={handleAddMemberClick}
                  className="inline-flex items-center px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  <CirclePlus className="w-4 h-4 mr-1.5" />
                  Add Family Member
                </button>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {membersArray.map((member) => (
                  <div
                    key={member._id}
                    className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between relative group"
                  >
                    <div>
                      {/* Top Bar: Badges and Edit Button */}
                      <div className="flex items-start justify-between">
                        <Avatar
                          src={member.dp}
                          firstName={member.firstName}
                          lastName={member.lastName}
                          size="lg"
                          className="ring-2 ring-gray-100"
                        />

                        <div className="flex items-center space-x-1.5">
                          {member.familyHead && (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
                              title="Family Head"
                            >
                              <Crown className="w-3 h-3 mr-1 text-amber-500 fill-amber-400" />
                              Head
                            </span>
                          )}
                          <button
                            onClick={() => handleEditMemberClick(member)}
                            className="p-1.5 rounded-lg bg-gray-50 hover:bg-primary-50 text-gray-500 hover:text-primary-600 transition-colors"
                            title="Edit details"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Name and Approval Status */}
                      <div className="mt-3.5">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-base font-bold text-gray-900 truncate">
                            {member.firstName} {member.lastName}
                          </h4>
                          {member.isApproved ? (
                            <CircleCheckBig
                              className="w-4 h-4 text-blue-600 flex-shrink-0"
                              title="Approved by admin"
                            />
                          ) : (
                            <span
                              className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50 text-amber-700"
                              title="Pending approval"
                            >
                              <Clock className="w-2.5 h-2.5 mr-0.5 text-amber-600" />
                              Pending
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="mt-3 space-y-1 text-xs text-gray-500">
                          {member.phoneNumber && (
                            <div className="flex items-center truncate">
                              <Phone className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{member.phoneNumber}</span>
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center truncate">
                              <Mail className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </div>
                          )}
                          {member.address && (
                            <div className="flex items-center truncate">
                              <MapPin className="w-3.5 h-3.5 mr-2 text-gray-400 flex-shrink-0" />
                              <span className="truncate capitalize">{member.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Status</span>
                      <span className={member.isApproved ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                        {member.isApproved ? "Published in Directory" : "Pending Admin Review"}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add Member Card */}
                <div
                  onClick={handleAddMemberClick}
                  className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary-400 hover:bg-primary-50/20 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[200px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                    <CirclePlus className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-900">Add Another Member</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                    Include family members so they appear in the community directory
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Banner Crop Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-lg">
              <h3 className="text-base font-bold text-gray-900 mb-3">Crop Banner Image</h3>
              <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gray-900">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropSave}
                  className="px-4 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Save Banner
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Member Add / Edit Modal */}
        {isMemberModalOpen && selectedMember && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedMember._id ? "Edit Family Member" : "Add New Family Member"}
                </h3>
                <button
                  onClick={closeMemberModal}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Upload Area */}
              <div className="my-5 text-center">
                <div
                  onClick={() => document.getElementById("memberImageInput").click()}
                  className="relative mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary-500 cursor-pointer group flex items-center justify-center bg-gray-50"
                >
                  {selectedMember.dp ? (
                    <img
                      src={selectedMember.dp}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-primary-600">
                      <ImageUp className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-medium">Upload</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">Click to select a profile photo</p>
                <input
                  type="file"
                  id="memberImageInput"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setSelectedMember((prev) => ({
                        ...prev,
                        dp: imageUrl,
                        dpFile: file,
                      }));
                    }
                  }}
                />
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={selectedMember.firstName || ""}
                      onChange={(e) => {
                        setSelectedMember({ ...selectedMember, firstName: e.target.value });
                        setFieldErrors({ ...fieldErrors, firstName: null });
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                      placeholder="e.g. John"
                    />
                    {fieldErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={selectedMember.lastName || ""}
                      onChange={(e) => {
                        setSelectedMember({ ...selectedMember, lastName: e.target.value });
                        setFieldErrors({ ...fieldErrors, lastName: null });
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                      placeholder="e.g. Doe"
                    />
                    {fieldErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={selectedMember.phoneNumber || ""}
                    onChange={(e) =>
                      setSelectedMember({ ...selectedMember, phoneNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                    placeholder="e.g. +91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={selectedMember.email || ""}
                    onChange={(e) =>
                      setSelectedMember({ ...selectedMember, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                    placeholder="e.g. john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Address / Colony
                  </label>
                  <input
                    type="text"
                    value={selectedMember.address || ""}
                    onChange={(e) =>
                      setSelectedMember({ ...selectedMember, address: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                    placeholder="e.g. House 42, Sector B"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={selectedMember.dob || ""}
                    onChange={(e) =>
                      setSelectedMember({ ...selectedMember, dob: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                {/* Family Head Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!selectedMember.familyHead}
                      onChange={(e) =>
                        setSelectedMember({ ...selectedMember, familyHead: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-xs font-semibold text-gray-700 flex items-center">
                      <Crown className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-400" />
                      Mark as Family Head
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-6 space-x-2 pt-4 border-t border-gray-100">
                <button
                  onClick={closeMemberModal}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={selectedMember._id ? handleMemberSave : handleMemberCreate}
                  className="px-5 py-2 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Save Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
