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
    skills: [], // Initialize as an empty array
    workExperience: [], // Initialize as an empty array
    education: [], // Initialize as an empty array
    certifications: [], // Initialize as an empty array
    hobbies: [], // Initialize as an empty array
    references: "", // Initialize as an empty string
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null); // New state for profile picture
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0); // Track the active tab
  const navigate = useNavigate();

  // Fetch user data on component mount
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

  // Handle CV upload and proceed to the next tab
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
      setSelectedTab(1); // Move to the 'Profile Details' tab
    } catch (error) {
      toast.error(error.response?.data?.message || "CV upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle profile picture upload
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
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Profile picture upload failed"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission for profile update
  const handleProfileUpdate = async () => {
    const { firstName, lastName, phone, address, email, summary } = userData;

    // Ensure required fields are filled out
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
      setSelectedTab(2); // Move to the 'Upload Profile Picture' tab
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-12">
      <Toaster />
      <div className="max-w-xl w-full space-y-8">
        <h2 className="text-2xl font-semibold text-center">Update Profile</h2>

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
            {/* Tab for CV Upload */}
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
                    handleCVUpload(file); // Upload CV on file selection
                  }}
                />
              </div>
            </Tab.Panel>

            {/* Tab for Editing Profile Details */}
            <Tab.Panel>
              <div className="space-y-4">
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
                <div>
                  <label className="block text-gray-700">Summary</label>
                  <textarea
                    value={userData.summary}
                    onChange={(e) =>
                      setUserData({ ...userData, summary: e.target.value })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                    rows="3"
                  />
                </div>
                {/* Skills Section */}
                <div>
                  <label className="block text-gray-700">Skills</label>
                  <input
                    type="text"
                    value={userData.skills ? userData.skills.join(", ") : ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        skills: e.target.value.split(", "),
                      })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                    placeholder="e.g. JavaScript, React, Node.js"
                  />
                </div>

                {/* Hobbies Section */}
                <div>
                  <label className="block text-gray-700">Hobbies</label>
                  <input
                    type="text"
                    value={userData.hobbies ? userData.hobbies.join(", ") : ""}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        hobbies: e.target.value.split(", "),
                      })
                    }
                    className="w-full mt-1 border rounded-lg p-2"
                    placeholder="e.g. Reading, Traveling, Cooking"
                  />
                </div>

                {/* Add buttons for submitting the profile update */}
                <button
                  onClick={handleProfileUpdate}
                  className="mt-4 w-full bg-blue-500 text-white p-2 rounded-lg"
                  disabled={isUploading}
                >
                  {isUploading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </Tab.Panel>

            {/* Tab for Uploading Profile Picture */}
            <Tab.Panel>
              <div className="flex justify-center items-center border-dashed border-2 border-gray-300 rounded-md p-4 cursor-pointer">
                <label
                  htmlFor="profile-picture-upload"
                  className="text-gray-500 cursor-pointer"
                >
                  {profilePicFile
                    ? `Selected File: ${profilePicFile.name}`
                    : "Drag and drop a profile picture or click to upload"}
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setProfilePicFile(file);
                    handleProfilePictureUpload(file); // Upload profile picture on file selection
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
