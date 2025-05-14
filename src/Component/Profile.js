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
    setSelectedMember(member);
    setInitialMemberState(member); // Store initial state
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
      <main className="profile-page">
        {(loading || memberLoading) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}
        {userData && (
          <>
            <section className="relative block h-[300px] sm:h-[400px] md:h-[300px] lg:h-[500px]">
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
                  size={30}
                  color="white"
                  className="absolute z-10 top-0 right-0 m-5 hover:cursor-pointer hover:bg-gray-700 p-1 rounded"
                  onClick={handleImagePlusClick}
                />
                <select
                  className="sticky z-10 top-0 left-0 m-5 bg-gray-400 text-white p-2 rounded hover:bg-gray-700"
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
            <section className="relative py-16 bg-blueGray-200">
              <div className="container mx-auto px-4">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-40">
                  <div className="px-6">
                    <div className="mt-2" ref={aboutUsRef}>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-normal mb-2 text-blueGray-700 flex items-center justify-between">
                        About Us 📝
                        <button
                          onClick={handleEditAboutUsClick}
                          className="ml-2 text-sm text-blue-500"
                        >
                          <Pencil size={20} />
                        </button>
                      </h3>
                      {isEditingAboutUs ? (
                        <div>
                          <textarea
                            value={aboutUsText || ""}
                            onChange={handleAboutUsChange}
                            className="w-full p-2 border rounded"
                          />
                          <button
                            onClick={handleAboutUsSave}
                            className="btn btn-success text-white p-2 rounded mt-2"
                          >
                            Save 💾
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base md:text-lg leading-normal mt-0 mb-2 text-blueGray-400">
                          {userData.aboutUs ? userData.aboutUs : ""}
                        </p>
                      )}
                    </div>
                    <div className="py-10">
                      <h4 className="text-2xl font-semibold leading-normal mb-2 text-blueGray-700">
                        Family Members 👨‍👩‍👧‍👦
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {userData.membersArray &&
                          userData.membersArray.map((member) => (
                            <div
                              key={member._id}
                              className="card bg-base-100 shadow-md hover:shadow-2xl w-72"
                            >
                              <figure className="px-4 pt-4 ">
                                <img
                                  src={`${member.dp}`}
                                  alt={`${member.firstName} ${member.lastName}`}
                                  className="h-60 w-full object-contain"
                                  loading="lazy"
                                  onError={(e) => {
                                    e.target.src =
                                      "/path/to/fallback-image.jpg";
                                  }}
                                />
                                {member.familyHead ? (
                                  <div
                                    className="tooltip absolute top-5 left-5"
                                    data-tip="Family head"
                                  >
                                    <button className="btn btn-ghost btn-sm">
                                      <Crown size={20} color="yellow" />
                                    </button>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <FilePenLine
                                  className="absolute top-5 right-5 hover:cursor-pointer bg-gray-700 p-1 rounded"
                                  color="white"
                                  size={30}
                                  onClick={() => handleFilePenLineClick(member)}
                                />
                              </figure>
                              <div className="card-body">
                                <h2 className="card-title text-sm">
                                  {member.isApproved && (
                                    <div
                                      className="tooltip"
                                      data-tip="approved by admin"
                                    >
                                      {/* <button className="btn">Hover me</button> */}
                                      <span>
                                        {" "}
                                        <CircleCheckBig
                                          color="#0084ff"
                                          className=" w-fit "
                                        />{" "}
                                      </span>{" "}
                                    </div>
                                  )}
                                  <span className="capitalize ">
                                    {" "}
                                    {member.firstName}
                                  </span>{" "}
                                  <span className="capitalize">
                                    {member.lastName}
                                  </span>
                                </h2>
                                <p className="text-xs">
                                  <strong>Phone Number:</strong>{" "}
                                  {member.phoneNumber}
                                </p>
                                <p className="text-xs">
                                  <strong>Email:</strong> {member.email}
                                </p>
                                <p className="text-xs">
                                  <strong>Address:</strong> {member.address}
                                </p>
                              </div>
                            </div>
                          ))}
                        <div
                          className="card bg-base-100 shadow-md hover:shadow-2xl flex items-center cursor-pointer justify-center w-72 min-h-[412px]"
                          onClick={handleAddMemberClick}
                        >
                          <CirclePlus size={48} className="text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {userData.membersArray.length > 0 &&
                    < button className="btn btn-ghost" onClick={handleRequestApproval}>Request Approval</button>
                  }

              </div>
            </div>
          </section>
      </>
        )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <div className="relative w-full h-64 sm:h-80 md:h-96">
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
                className="bg-green-500 text-white p-2 rounded"
              >
                Save
              </button>
              <button
                onClick={closeModal}
                className="bg-red-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isMemberModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl transform transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-10 w-full">
              <h3 className="text-2xl font-bold text-center text-gray-800">
                {" "}
                {selectedMember._id
                  ? "Edit Member Details"
                  : "Add New Member"}
              </h3>
              <X
                size={20}
                color="red"
                onClick={closeMemberModal}
                className="hover:cursor-pointer"
              />
            </div>
            {selectedMember.dp ? (
              <img
                src={selectedMember.dp}
                alt="Profile"
                className="w-full h-48 object-contain rounded-lg mb-4"
                onClick={() =>
                  document.getElementById("memberImageInput").click()
                } // Trigger file input click
              />
            ) : (
              <ImageUp
                size={48}
                className="w-full h-48 object-contain rounded-lg mb-4 cursor-pointer"
                onClick={() =>
                  document.getElementById("memberImageInput").click()
                }
              />
            )}
            {/* Profile Picture Field */}
            {fieldErrors.dpFile && (
              <p className="text-red-500 text-xs text-center">
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
                  })); // Store file object
                }
              }}
            />
            <div className="space-y-2">
              {/* First Name Field */}
              <label className="block text-gray-600">
                <strong>First Name:</strong>
                <input
                  type="text"
                  value={selectedMember.firstName}
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    setSelectedMember((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }));
                    setFieldErrors((prev) => ({ ...prev, firstName: null }));
                  }}
                />
                {fieldErrors.firstName && (
                  <p className="text-red-500 text-xs">
                    {fieldErrors.firstName}
                  </p>
                )}
              </label>
              {/* Last Name Field */}
              <label className="block text-gray-600">
                <strong>Last Name:</strong>
                <input
                  type="text"
                  value={selectedMember.lastName}
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    setSelectedMember((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }));
                    setFieldErrors((prev) => ({ ...prev, lastName: null }));
                  }}
                />
                {fieldErrors.lastName && (
                  <p className="text-red-500 text-xs">
                    {fieldErrors.lastName}
                  </p>
                )}
              </label>
              {/* Address Field */}
              <label className="block text-gray-600">
                <strong>Address:</strong>
                <input
                  type="text"
                  value={selectedMember.address}
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    setSelectedMember((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }));
                    setFieldErrors((prev) => ({ ...prev, address: null }));
                  }}
                />
                {fieldErrors.address && (
                  <p className="text-red-500 text-xs">
                    {fieldErrors.address}
                  </p>
                )}
              </label>
              {/* Email Field */}
              <label className="block text-gray-600">
                <strong>Email:</strong>
                <input
                  type="email"
                  value={selectedMember.email}
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    setSelectedMember((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    setFieldErrors((prev) => ({ ...prev, email: null }));
                  }}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs">{fieldErrors.email}</p>
                )}
              </label>
              {/* Phone Number Field */}
              <label className="block text-gray-600">
                <strong>Phone Number:</strong>
                <input
                  type="text" // Changed to text to allow for international numbers and formatting
                  value={selectedMember.phoneNumber}
                  className="w-full p-2 border rounded"
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
                  <p className="text-red-500 text-xs">
                    {fieldErrors.phoneNumber}
                  </p>
                )}
              </label>
              {/* Date of Birth Field */}
              <label className="block text-gray-600">
                <strong>Date of Birth:</strong>
                <input
                  type="date"
                  value={selectedMember.dob}
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    setSelectedMember((prev) => ({
                      ...prev,
                      dob: e.target.value,
                    }));
                    setFieldErrors((prev) => ({ ...prev, dob: null }));
                  }}
                />
                {fieldErrors.dob && (
                  <p className="text-red-500 text-xs">{fieldErrors.dob}</p>
                )}
              </label>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={
                  selectedMember._id ? handleMemberSave : handleMemberCreate
                }
                className="bg-green-500 text-white p-2 rounded"
              >
                Save
              </button>
              <button
                onClick={closeMemberModal}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </main >
    </>
  );
};

export default Profile;
