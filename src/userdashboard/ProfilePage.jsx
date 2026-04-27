import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import WorkExperience from './WorkExperience';
import Education from './Education';
import Profile from './Profile';
import Sidebar from './Sidebar';
import Certificates from './Certificates';
import HandleLogout from '../logout';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    experiences: [],
    education: [],
    bio: '',
    certifications: [],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = Cookies.get('userId');
        const token = Cookies.get('token');

        if (!userId || !token) {
          console.error('User ID or token is missing.');
          return;
        }

        const response = await fetch(`http://localhost:5001/api/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: `${data.profile.first_name} ${data.profile.last_name}`,
            email: data.profile.email,
            profilePicture: data.profile.profilePicture || '/path/to/default-profile.jpg',
            experiences: data.profile.work_experience || [],
            education: data.profile.education || [],
            bio: data.profile.bio || '',
            certifications: data.profile.certifications || [],
          });
        } else {
          console.error('Failed to fetch user profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      <div className='flex bg-gray-800 h-[8vh] w-full justify-center items-center'>
       <div className='w-[80%]'></div>
      <div className='flex gap-5'>
      <Link to="/" className='mt-1 text-white'>Home</Link>
            <HandleLogout />
          </div>
      </div>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className='bg-gradient-to-r from-[#25b2e6] to-blue-500 h-[10%] w-full'>
          <h1 className='text-white text-center pt-5'>Welcome back {userData.name}</h1>
        </div>
        <div className='flex mt-10 gap-10 w-full'>
          <div className='w-[80%]'>
            <WorkExperience experiences={userData.experiences} />
            <Education education={userData.education} />
            <Certificates certifications={userData.certifications} />
          </div>
          <div>
            <Profile user={userData} />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfilePage;
