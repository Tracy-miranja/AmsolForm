import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProfilePage = () => {
  const { userId, token } = useUser(); // Get userId and token from context
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    summary: "",
    skills: [],
    workExperience: [],
    education: [],
    certifications: [],
    hobbies: [],
    references: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
      } catch (error) {
        toast.error("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, [userId, token]);

  const handleCVUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.put(
        `http://localhost:5000/api/profile/resume/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("CV uploaded successfully");
      setSelectedTab(1);
    } catch (error) {
      toast.error(error.response?.data?.message || "CV upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfilePictureUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.put(
        `http://localhost:5000/api/profile/picture/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Profile picture uploaded successfully");
      navigate("/profile-details", { state: { userData } });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Profile picture upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    const { firstName, lastName, phone, address, email, summary } = userData;

    if (!phone || !summary) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      const profileData = {
        profile: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          address: address,
          email: email,
          bio: summary,
          skills: userData.skills,
          work_experience: userData.workExperience,
          education: userData.education,
          certifications: userData.certifications,
          hobbies: userData.hobbies,
          references: userData.references,
        },
      };

      await axios.put(
        `http://localhost:5000/api/profile/${userId}`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Profile updated successfully!");
      setSelectedTab(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12">
      <Toaster />
      <div className="max-w-4xl w-full space-y-8">
        {/* Salutation */}
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Welcome, {userData.username}!
        </h2>

        {/* Heading */}
        <h2 className="text-xl text-gray-700 text-center ">
          Complete Your Profile
        </h2>
        {/* Paragraph */}
        <p className="text-gray-600 text-center">
          Please follow the steps below to update your profile.
        </p>
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 bg-blue-900/20 p-1 rounded-md">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Upload CV
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Profile Details
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              Upload Profile Picture
            </Tab>
          </Tab.List>

          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <div className="flex justify-center items-center border-dashed border-2 border-gray-300 rounded-md p-4 cursor-pointer">
                <label
                  htmlFor="resume-upload"
                  className="text-gray-500 cursor-pointer"
                >
                  {resumeFile
                    ? `Selected File: ${resumeFile.name}`
                    : "Drag and drop CV or click to upload"}
                </label>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setResumeFile(file);
                    handleCVUpload(file);
                  }}
                />
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="space-y-4">
                {/* Row for First and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">First Name</label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                      className="w-full mt-1 border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Last Name</label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                      className="w-full mt-1 border rounded-lg p-2"
                    />
                  </div>
                </div>

                {/* Row for Phone and Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                      className="w-full mt-1 border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Address</label>
                    <input
                      type="text"
                      value={userData.address}
                      onChange={(e) =>
                        setUserData({ ...userData, address: e.target.value })
                      }
                      className="w-full mt-1 border rounded-lg p-2"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                    disabled
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-gray-700">Bio</label>
                  <textarea
                    value={userData.summary}
                    onChange={(e) =>
                      setUserData({ ...userData, summary: e.target.value })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>

                {/* Skills and Hobbies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Skills</label>
                    <input
                      type="text"
                      value={userData.skills}
                      onChange={(e) =>
                        setUserData({ ...userData, skills: e.target.value })
                      }
                      className="w-full mt-1 border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700">Hobbies</label>
                    <input
                      type="text"
                      value={userData.hobbies}
                      onChange={(e) =>
                        setUserData({ ...userData, hobbies: e.target.value })
                      }
                      className="w-full mt-1 border rounded-lg p-2"
                    />
                  </div>
                </div>

                {/* Work Experience, Education, Certifications, and References */}
                <div>
                  <label className="block text-gray-700">Work Experience</label>
                  <textarea
                    value={userData.workExperience}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        workExperience: e.target.value,
                      })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Education</label>
                  <textarea
                    value={userData.education}
                    onChange={(e) =>
                      setUserData({ ...userData, education: e.target.value })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">Certifications</label>
                  <textarea
                    value={userData.certifications}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        certifications: e.target.value,
                      })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-gray-700">References</label>
                  <textarea
                    value={userData.references}
                    onChange={(e) =>
                      setUserData({ ...userData, references: e.target.value })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>

                {/* Update Button */}
                <button
                  onClick={handleProfileUpdate}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  {isUploading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="flex justify-center items-center border-dashed border-2 border-gray-300 rounded-md p-4 cursor-pointer">
                <label
                  htmlFor="profile-pic-upload"
                  className="text-gray-500 cursor-pointer"
                >
                  {profilePicFile
                    ? `Selected File: ${profilePicFile.name}`
                    : "Drag and drop profile picture or click to upload"}
                </label>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setProfilePicFile(file);
                    handleProfilePictureUpload(file);
                  }}
                />
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ProfilePage;
