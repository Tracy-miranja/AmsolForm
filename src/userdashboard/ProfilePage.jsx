import React, { useState, useEffect } from 'react';
import WorkExperience from './WorkExperience';
import Education from './Education';
import Profile from './Profile';
import Sidebar from './Sidebar';
import Certificates from './Certificates';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePicture: '/path/to/profile.jpg',
    experiences: [
      { company: 'Company A', role: 'Developer', duration: 'Jan 2021 - Present' },
      { company: 'Company B', role: 'Intern', duration: 'Jan 2020 - Dec 2020' },
    ],
    education: [
      { institution: 'University of XYZ', degree: 'B.Sc. Computer Science', year: '2020' },
      { institution: 'High School ABC', degree: 'High School Diploma', year: '2016' },
    ],
  });

  useEffect(() => {
    // Fetch user data from the API if needed
    // fetch('/api/user-profile').then(res => res.json()).then(data => setUserData(data));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <div className='bg-gradient-to-r from-[#25b2e6] to-blue-500 h-[10%] w-full'></div>
        <div className='flex mt-10 gap-10 w-full'>    
        <div className='w-[80%]'>
        <WorkExperience experiences={userData.experiences} />
        <Education education={userData.education} />
        <Certificates />
        </div>
        <div><Profile user={userData} /></div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
