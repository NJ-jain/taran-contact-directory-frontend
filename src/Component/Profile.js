import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approvalRequestThunk, getUserThunk, updateUserThunk } from "../features/user/userSlice";
import {
  CircleCheckBig,
  CirclePlus,
  Crown,
  FilePenLine,
  ImagePlus,
  ImageUp,
  Pencil,
  X,
} from "lucide-react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import {
  createMemberThunk,
  updateMemberThunk,
} from "../features/member/memberSlice";
import Navbar from "./Navbar";

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
  const [aboutUsText, setAboutUsText] = useState(userData?.aboutUs || "");

  const aboutUsRef = useRef(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [initialMemberState, setInitialMemberState] = useState(null);

  // Function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  const handleMemberSave = () => {
    if (selectedMember) {
      const formData = new FormData();

      // Check if the image has changed
      if (selectedMember.dpFile) {
        formData.append("dp", selectedMember.dpFile);
      }
      if (selectedMember.dob !== initialMemberState.dob) {
        formData.append("dob", selectedMember.dob);
      }
      // Compare each field and append only if changed
      if (selectedMember.firstName !== initialMemberState.firstName) {
        formData.append("firstName", selectedMember.firstName);
      }
      if (selectedMember.lastName !== initialMemberState.lastName) {
        formData.append("lastName", selectedMember.lastName);
      }
      if (selectedMember.address !== initialMemberState.address) {
        formData.append("address", selectedMember.address);
      }
      if (selectedMember.email !== initialMemberState.email) {
        formData.append("email", selectedMember.email);
      }
      if (selectedMember.phoneNumber !== initialMemberState.phoneNumber) {
        formData.append("phoneNumber", selectedMember.phoneNumber);
      }

      dispatch(
        updateMemberThunk({
          memberId: selectedMember._id,
          memberData: formData,
        })
      );
      closeMemberModal();
    }
  };

  // State to track field errors
  const [fieldErrors, setFieldErrors] = useState({});

  const validateFields = () => {
    let errors = {};
    let formIsValid = true;

    // Add validation checks for each field
    if (!selectedMember.firstName) {
      errors.firstName = "First name is required.";
      formIsValid = false;
    }
    if (!selectedMember.lastName) {
      errors.lastName = "Last name is required.";
      formIsValid = false;
    }
    if (!selectedMember.address) {
      errors.address = "Address is required.";
      formIsValid = false;
    }
    // if (!selectedMember.email) {
    //   errors.email = "Email is required.";
    //   formIsValid = false;
    // }
    // if (!selectedMember.phoneNumber) {
    //   errors.phoneNumber = "Phone number is required.";
    //   formIsValid = false;
    // }
    if (!selectedMember.dob) {
      errors.dob = "Date of birth is required.";
      formIsValid = false;
    }

    setFieldErrors(errors);
    return formIsValid;
  };

  const handleMemberCreate = () => {
    if (!selectedMember.dpFile) {
      alert("Profile picture is required.");
      return;
    }

    if (validateFields()) {
      const formData = new FormData();
      formData.append("firstName", selectedMember.firstName);
      formData.append("lastName", selectedMember.lastName);
      formData.append("address", selectedMember.address);
      formData.append("email", selectedMember.email);
      formData.append("phoneNumber", selectedMember.phoneNumber);
      formData.append("dob", selectedMember.dob);

      if (selectedMember.dpFile) {
        formData.append("dp", selectedMember.dpFile);
        setFieldErrors((prevErrors) => ({ ...prevErrors, dpFile: null }));
      }

      dispatch(createMemberThunk({ memberData: formData }));
      closeMemberModal();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutUsRef.current && !aboutUsRef.current.contains(event.target)) {
        setIsEditingAboutUs(false);
      }
    };

    if (isEditingAboutUs) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditingAboutUs]);

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
      setFieldErrors((prevErrors) => ({ ...prevErrors, dpFile: null }));
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
      const croppedImage = await getCroppedImg(
        selectedImage,
        croppedAreaPixels
      );
      const userData = {
        bannerImage: croppedImage,
      };
      dispatch(updateUserThunk(userData));
      closeModal();
    } catch (error) {
      console.error("Failed to crop image", error);
    }
  };

  const handleEditAboutUsClick = () => {
    setIsEditingAboutUs(true);
  };

  const handleAboutUsChange = (event) => {
    setAboutUsText(event.target.value);
  };

  const handleAboutUsSave = () => {
    const userData = {
      aboutUs: aboutUsText,
    };
    dispatch(updateUserThunk(userData));
    setIsEditingAboutUs(false);
  };

  const handleFilePenLineClick = (member) => {
    // Format the date properly for the date input
    const formattedMember = {
      ...member,
      dob: formatDateForInput(member.dob)
    };
    setSelectedMember(formattedMember);
    setInitialMemberState(formattedMember); // Store initial state
    setIsMemberModalOpen(true);
  };

  const closeMemberModal = () => {
    setIsMemberModalOpen(false);
    setSelectedMember(null);
  };

  const handleAddMemberClick = () => {
    setSelectedMember({
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phoneNumber: "",
      dob: "",
      dp: null, // Default image or placeholder
      dpFile: null,
    });
    setInitialMemberState(null); // No initial state for new member
    setIsMemberModalOpen(true);
  };

  const bannerUrl = useMemo(() => {
    return userData?.banner
      ? `${userData.banner}`
      : "/path/to/fallback-banner.jpg";
  }, [userData?.banner]);

  const handleRequestApproval = () => {
    dispatch(approvalRequestThunk())
  }

  useEffect(() => {
    dispatch(getUserThunk());
  }, [dispatch]);

  if (error) {
    // Ensure that error is converted to a string if it's not already
    return <div>Error: {error.message || String(error)}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="profile-page min-h-screen bg-gray-50">
        {(loading || memberLoading) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}
        {userData && (
          <>
            {/* Banner Section */}
            <section className="relative block h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px]">
              <div
                className="absolute top-0 w-full h-full bg-center bg-cover"
                style={{
                  backgroundImage: `url('${bannerUrl}')`,
                }}
              >
                <span
                  id="blackOverlay"
                  className="w-full h-full absolute opacity-50 bg-black"
                ></span>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  name="bannerImage"
                />
                <ImagePlus
                  size={24}
                  color="white"
                  className="absolute z-10 top-2 right-2 sm:top-4 sm:right-4 md:top-5 md:right-5 hover:cursor-pointer hover:bg-gray-700 p-1 rounded"
                  onClick={handleImagePlusClick}
                />
                <select
                  className="absolute z-10 top-2 left-2 sm:top-4 sm:left-4 md:top-5 md:left-5 bg-gray-400 text-white p-1 sm:p-2 rounded hover:bg-gray-700 text-xs sm:text-sm md:text-base"
                  value={userData.category}
                  onChange={(e) => {
                    const selectedCategory = e.target.value;
                    console.log("Selected category:", selectedCategory);
                    dispatch(updateUserThunk({ category: selectedCategory }));
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="ashoka_garden">Ashoka Garden 🌳</option>
                  <option value="kolar">Kolar 🏞️</option>
                  <option value="mandideep">Mandideep 🏭</option>
                  <option value="pansheel_nagar">Pansheel Nagar 🏘️</option>
                  <option value="mangalvara">Mangalvara 🕌</option>
                </select>
              </div>
            </section>

            {/* Main Content Section */}
            <section className="relative py-8 sm:py-12 md:py-16 bg-gray-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32 xl:-mt-40">
                  <div className="px-4 sm:px-6 lg:px-8">
                    {/* About Us Section */}
                    <div className="mt-4 sm:mt-6 md:mt-8" ref={aboutUsRef}>
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-normal mb-2 text-gray-700 flex items-center justify-between">
                        About Us 📝
                        <button
                          onClick={handleEditAboutUsClick}
                          className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={16} className="sm:w-5 sm:h-5" />
                        </button>
                      </h3>
                      {isEditingAboutUs ? (
                        <div className="space-y-2">
                          <textarea
                            value={aboutUsText || ""}
                            onChange={handleAboutUsChange}
                            className="w-full p-2 sm:p-3 border rounded text-sm sm:text-base"
                            rows="4"
                          />
                          <button
                            onClick={handleAboutUsSave}
                            className="btn btn-success text-white p-2 rounded text-sm sm:text-base"
                          >
                            Save 💾
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base md:text-lg leading-normal mt-0 mb-2 text-gray-600">
                          {userData.aboutUs ? userData.aboutUs : ""}
                        </p>
                      )}
                    </div>

                    {/* Family Members Section */}
                    <div className="py-6 sm:py-8 md:py-10">
                      <h4 className="text-xl sm:text-2xl font-semibold leading-normal mb-4 sm:mb-6 text-gray-700">
                        Family Members 👨‍👩‍👧‍👦
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {userData.membersArray &&
                          userData.membersArray.map((member) => (
                            <div
                              key={member._id}
                              className="card bg-base-100 shadow-md hover:shadow-2xl transition-shadow duration-300"
                            >
                              <figure className="px-3 sm:px-4 pt-3 sm:pt-4">
                                <img
                                  src={`${member.dp}`}
                                  alt={`${member.firstName} ${member.lastName}`}
                                  className="h-48 sm:h-56 md:h-60 w-full object-contain rounded-lg"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.src =
                                      "/path/to/fallback-image.jpg";
                                  }}
                                />
                                {member.familyHead ? (
                                  <div
                                    className="tooltip absolute top-2 left-2 sm:top-3 sm:left-3"
                                    data-tip="Family head"
                                  >
                                    <button className="btn btn-ghost btn-xs sm:btn-sm">
                                      <Crown size={16} className="sm:w-5 sm:h-5" color="yellow" />
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <FilePenLine
                                  className="absolute top-2 right-2 sm:top-3 sm:right-3 hover:cursor-pointer bg-gray-700 p-1 rounded sm:w-7 sm:h-7"
                                  color="white"
                                  size={20}
                                  onClick={() => handleFilePenLineClick(member)}
                                />
                              </figure>
                              <div className="card-body p-3 sm:p-4">
                                <h2 className="card-title text-sm sm:text-base">
                                  {member.isApproved && (
                                    <div
                                      className="tooltip"
                                      data-tip="approved by admin"
                                    >
                                      <span>
                                        <CircleCheckBig
                                          color="#0084ff"
                                          size={16}
                                          className="sm:w-5 sm:h-5"
                                        />
                                      </span>
                                    </div>
                                  )}
                                  <span className="capitalize">
                                    {member.firstName}
                                  </span>{" "}
                                  <span className="capitalize">
                                    {member.lastName}
                                  </span>
                                </h2>
                                <div className="space-y-1 text-xs sm:text-sm">
                                  <p>
                                    <strong>Phone:</strong> {member.phoneNumber}
                                  </p>
                                  <p>
                                    <strong>Email:</strong> {member.email}
                                  </p>
                                  <p>
                                    <strong>Address:</strong> {member.address}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        
                        {/* Add Member Card */}
                        <div
                          className="card bg-base-100 shadow-md hover:shadow-2xl flex items-center cursor-pointer justify-center min-h-[280px] sm:min-h-[320px] md:min-h-[360px] transition-shadow duration-300"
                          onClick={handleAddMemberClick}
                        >
                          <div className="text-center">
                            <CirclePlus size={32} className="sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2" />
                            <p className="text-sm sm:text-base text-gray-600">Add New Member</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Request Approval Button */}
                    {userData.membersArray.length > 0 && !userData.membersArray.every(member => member.isApproved) && (
                      <div className="pb-6 sm:pb-8">
                        <button 
                          className="btn btn-primary text-white px-4 py-2 rounded-lg text-sm sm:text-base"
                          onClick={handleRequestApproval}
                        >
                          Request Approval
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Banner Crop Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-4">
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
              <div className="relative w-full h-48 sm:h-64 md:h-80">
                <Cropper
                  image={selectedImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={handleCropSave}
                  className="bg-green-500 text-white p-2 rounded text-sm sm:text-base"
                >
                  Save
                </button>
                <button
                  onClick={closeModal}
                  className="bg-red-500 text-white p-2 rounded text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Member Modal */}
        {isMemberModalOpen && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl transform transition-all duration-300 ease-in-out max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                  {selectedMember._id ? "Edit Member Details" : "Add New Member"}
                </h3>
                <X
                  size={20}
                  color="red"
                  onClick={closeMemberModal}
                  className="hover:cursor-pointer"
                />
              </div>
              
              {/* Profile Image */}
              {selectedMember.dp ? (
                <img
                  src={selectedMember.dp}
                  alt="Profile"
                  className="w-full h-32 sm:h-40 md:h-48 object-contain rounded-lg mb-4 cursor-pointer"
                  onClick={() => document.getElementById("memberImageInput").click()}
                />
              ) : (
                <div 
                  className="w-full h-32 sm:h-40 md:h-48 border-2 border-dashed border-gray-300 rounded-lg mb-4 flex items-center justify-center cursor-pointer hover:border-gray-400"
                  onClick={() => document.getElementById("memberImageInput").click()}
                >
                  <div className="text-center">
                    <ImageUp size={32} className="sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm sm:text-base text-gray-500">Click to upload image</p>
                  </div>
                </div>
              )}
              
              {/* Profile Picture Field */}
              {fieldErrors.dpFile && (
                <p className="text-red-500 text-xs text-center mb-2">
                  {fieldErrors.dpFile}
                </p>
              )}
              <input
                type="file"
                id="memberImageInput"
                style={{ display: "none" }}
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
              
              {/* Form Fields */}
              <div className="space-y-3 sm:space-y-4">
                {/* First Name Field */}
                <label className="block text-gray-600">
                  <strong className="text-sm sm:text-base">First Name:</strong>
                  <input
                    type="text"
                    value={selectedMember.firstName}
                    className="w-full p-2 sm:p-3 border rounded text-sm sm:text-base"
                    onChange={(e) => {
                      setSelectedMember((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }));
                      setFieldErrors((prev) => ({ ...prev, firstName: null }));
                    }}
                  />
                  {fieldErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.firstName}
                    </p>
                  )}
                </label>
                
                {/* Last Name Field */}
                <label className="block text-gray-600">
                  <strong className="text-sm sm:text-base">Last Name:</strong>
                  <input
                    type="text"
                    value={selectedMember.lastName}
                    className="w-full p-2 sm:p-3 border rounded text-sm sm:text-base"
                    onChange={(e) => {
                      setSelectedMember((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }));
                      setFieldErrors((prev) => ({ ...prev, lastName: null }));
                    }}
                  />
                  {fieldErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.lastName}
                    </p>
                  )}
                </label>
                
                {/* Address Field */}
                <label className="block text-gray-600">
                  <strong className="text-sm sm:text-base">Address:</strong>
                  <input
                    type="text"
                    value={selectedMember.address}
                    className="w-full p-2 sm:p-3 border rounded text-sm sm:text-base"
                    onChange={(e) => {
                      setSelectedMember((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }));
                      setFieldErrors((prev) => ({ ...prev, address: null }));
                    }}
                  />
                  {fieldErrors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.address}
                    </p>
                  )}
                </label>
                
                {/* Email Field */}
                <label className="block text-gray-600">
                  <strong className="text-sm sm:text-base">Email:</strong>
                  <input
                    type="email"
                    value={selectedMember.email}
                    className="w-full p-2 sm:p-3 border rounded text-sm sm:text-base"
                    onChange={(e) => {
                      setSelectedMember((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                      setFieldErrors((prev) => ({ ...prev, email: null }));
                    }}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </label>
                
                {/* Phone Number Field */}
                <label className="block text-gray-600">
                  <strong className="text-sm sm:text-base">Phone Number:</strong>
                  <input
                    type="text"
                    value={selectedMember.phoneNumber}
                    className="w-full p-2 sm:p-3 border rounded text-sm sm:text-base"
                    onChange={(e) => {
                      setSelectedMember((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }));
                      setFieldErrors((prev) => ({
                        ...prev,
                        phoneNumber: null,
                      }));
                    }}
                  />
                  {fieldErrors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.phoneNumber}
                    </p>
                  )}
                </label>
                
                {/* Date of Birth Field */}
                <label className="block text-gray-600">
                  <strong className="text-sm sm:text-base">Date of Birth:</strong>
                  <input
                    type="date"
                    value={selectedMember.dob || ''}
                    className="w-full p-2 sm:p-3 border rounded text-sm sm:text-base"
                    onChange={(e) => {
                      setSelectedMember((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }));
                      setFieldErrors((prev) => ({ ...prev, dob: null }));
                    }}
                  />
                  {fieldErrors.dob && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.dob}
                    </p>
                  )}
                </label>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end mt-4 sm:mt-6 space-x-2">
                <button
                  onClick={selectedMember._id ? handleMemberSave : handleMemberCreate}
                  className="bg-green-500 text-white p-2 sm:p-3 rounded text-sm sm:text-base hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={closeMemberModal}
                  className="bg-red-500 text-white p-2 sm:p-3 rounded text-sm sm:text-base hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Profile;
