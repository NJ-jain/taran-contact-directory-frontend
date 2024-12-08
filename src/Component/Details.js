import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMemberThunk } from "../features/member/memberSlice";
import Navbar from "./Navbar";

const Details = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const memberData = useSelector((state) => state.member.member);
    const member = memberData?.member || {};
    const loading = memberData?.loading;
    const error = memberData?.error;

    useEffect(() => {
        if (id) {
            dispatch(getMemberThunk({ id }));
        }
    }, [dispatch, id]);

    const handleMemberClick = (id) => {
        navigate(`/details/${id}`);
    };

    if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

    return (
        <>
            <Navbar />
            <main className="profile-page relative">
                {member && Object.keys(member).length > 0 && (
                    <>
                        {/* Banner */}
                        <div className="relative block h-[300px] sm:h-[400px] md:h-[300px] lg:h-[400px] xl:h-[500px]">
                            <div
                                className="top-0 w-full h-full bg-center bg-cover"
                                style={{
                                    backgroundImage: `url('${member?.userId?.banner}')`,
                                }}
                            >
                                <span
                                    id="blackOverlay"
                                    className="w-full h-full absolute opacity-50 bg-black"
                                ></span>
                            </div>
                        </div>

                        {/* Member Card */}
                        <div className=" max-w-sm mx-auto mt-6 xl:top-60 absolute top-40 left-1/2 -translate-x-1/2  translate-y-0 *: w-96 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                            <div className="flex flex-col items-center pt-10 pb-10">
                                <img
                                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                                    src={member.dp}
                                    alt={`${member.firstName} ${member.lastName}`}
                                />
                                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                                    {member.firstName} {member.lastName}
                                </h5>
                                <span className="text-sm text-gray-500 dark:text-gray-400 ">
                                    ✉️ {member.email}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 ">
                                    ☎️ {member.phoneNumber}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize" >
                                    📌 {member.address}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize" >
                                    📌 {member?.dob}
                                </span>
                                {/* <div className="flex mt-4 space-x-3 md:mt-6">
                  <button
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => handleMemberClick(member._id)}
                  >
                    View Details
                  </button>
                </div> */}
                            </div>
                        </div>

                        {/* Members List */}
                        <div className="mt-40 md:mt-40 lg:mt-10 xl:mt-5">
                            <div className="px-6">
                                <div className="py-10 border-blueGray-200 text-center">
                                    <h4 className="text-2xl font-semibold leading-normal mb-6 text-blueGray-700">
                                       Other Family Members
                                    </h4>
                                    <ul className="space-y-4">
                                        {[...member?.userId?.membersArray] // Create a shallow copy of the array
                                            .sort((a, b) => a.firstName.localeCompare(b.firstName)) // Then sort that copy
                                            .map((member) => (
                                                <li
                                                    key={member._id}
                                                    onClick={() => navigate(`/details/${member._id}`)}
                                                    className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition cursor-pointer"
                                                >
                                                    <img
                                                        className="w-12 h-12 rounded-full mr-4 border border-blueGray-200"
                                                        src={member.dp}
                                                        alt={`${member.firstName} ${member.lastName}`}
                                                    />
                                                    <div className="text-left">
                                                        <span className="block text-lg font-medium text-blueGray-700 capitalize">
                                                            {member.firstName} {member.lastName}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default Details;
