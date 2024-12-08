import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllMembersThunk } from '../features/member/memberSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector((state) => state.member);
  const location = useLocation(); // Initialize useLocation
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get('search');
    if(!queryParam) dispatch(getAllMembersThunk());
  }, [dispatch]);

  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredImage, setHoveredImage] = useState(''); // State to hold the hovered image source
  const [hoveredImagePosition, setHoveredImagePosition] = useState({ x: 0, y: 0 });

  // Filter members based on the search term
  const filteredMembers = members?.filter((member) => {
    const memberValues = Object.values(member).join(' ').toLowerCase();
    return memberValues.includes(searchTerm.toLowerCase());
  });

  const handleMouseEnter = (e, member) => {
    const rect = e.target.getBoundingClientRect();
    setHoveredImage(member); // Pass the entire member object
    setHoveredImagePosition({ x: rect.right, y: rect.top });
  };


  const handleDetailsClick = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="overflow-x-auto p-4 min-w-[100vw] min-h-[100vh] ">

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      )}
         { error ? (
          <p>Error: {error.message || 'An error occurred'}</p>
        ) :  filteredMembers?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              {/* Table Head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {filteredMembers?.map((member, index) => (
                  <tr key={member._id}>
                    <td>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={member?.dp || '/path/to/placeholder.jpg'}
                              alt={`${member.firstName} ${member.lastName}`}
                              onError={(e) => {
                                e.target.src = '/path/to/fallback-image.jpg';
                              }}
                              className="object-cover"
                              onMouseEnter={(e) => handleMouseEnter(e, member)}
                            // onMouseLeave={() => setHoveredImage('')} // Hide the image when the mouse leaves
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold capitalize">
                            {member.firstName} {member.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{member.phoneNumber}</td>
                    <td>{member.email}</td>
                    <td>{member.address}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleDetailsClick(member._id)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Table Footer */}
              <tfoot>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </tfoot>
            </table>
          </div> 
        ) : (
          <h3 className='absolute ' style={{top: "50%", left : "50%" , transform : "translate[-50%, -50%]"}}>No data present</h3> 
        )}
      </div>
      {hoveredImage && (
        <div
          className="p-1 absolute shadow-lg border border-gray-200 rounded-lg bg-white transition-all"
          style={{
            width: "200px",
            height: "auto", // Adjust height to auto to accommodate additional content
            top: `${hoveredImagePosition.y}px`,
            left: `${hoveredImagePosition.x + 10}px`,
            transform: 'translateY(-50%)',
            zIndex: 50,
          }}
          onMouseLeave={() => setHoveredImage('')} // Hide the image when the mouse leaves the image container
        >
          <img
            src={hoveredImage.dp}
            alt={`${hoveredImage.firstName} ${hoveredImage.lastName}`}
            className="w-full h-auto rounded-lg object-cover object-center" // Adjusted for proper centering
          />
          <div className="text-center mt-2">
            {hoveredImage.firstName} {hoveredImage.lastName}
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
