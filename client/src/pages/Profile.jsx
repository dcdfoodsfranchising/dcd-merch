import React, { useState, useEffect } from "react";
import { getUserDetails, updateUserDetails, updatePassword, uploadProfilePicture } from "../services/userService";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // For password validation errors
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false); // Toggle for password visibility

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);
        setFirstName(userDetails.firstName || "");
        setLastName(userDetails.lastName || "");
        setMobileNo(userDetails.mobileNo || "");
        setEmail(userDetails.email || "");
      } catch (error) {
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart = `${localPart[0]}${"*".repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
    return `${maskedLocalPart}@${domain}`;
  };

  const handleSaveDetails = async () => {
    if (!firstName || !lastName) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoadingDetails(true);
      await updateUserDetails({ firstName, lastName });
      toast.success("Details updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordError(""); // Clear previous errors

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoadingPassword(true);
      await updatePassword(currentPassword, newPassword, confirmPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully!");
    } catch (error) {
      if (error.message === "Current password is incorrect.") {
        setPasswordError("Current password is incorrect.");
      } else {
        setPasswordError(error.message || "Failed to update password.");
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const response = await uploadProfilePicture(file);
      setUser((prev) => ({ ...prev, profilePicture: response.profilePicture }));
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Failed to upload profile picture.");
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      {/* Main Heading */}
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start">
        {/* User Details */}
        <div className="w-full lg:w-2/3 lg:mr-8">
          <h2 className="text-lg font-medium mb-4">Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <p className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600 sm:text-sm">
                {mobileNo}
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveDetails}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
            disabled={loadingDetails}
          >
            {loadingDetails ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Profile Picture */}
        <div className="w-full lg:w-1/3 flex-shrink-0 mb-6 lg:mb-0">
          <h2 className="text-lg font-medium mb-2">Profile Picture</h2>
          <div className="flex flex-col items-center">
            <img
              src={user.profilePicture || "/assets/icons/profile.svg"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <label className="cursor-pointer text-red-600 text-sm hover:underline">
              Select Image
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">Email</h2>
        <p className="text-sm text-gray-600">{maskEmail(email)}</p>
      </div>

      {/* Password Section */}
      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">Password</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Enter your current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Enter your new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Confirm your new password"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
        </div>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={() => setShowPasswords(!showPasswords)}
              className="form-checkbox h-4 w-4 text-red-600"
            />
            <span className="ml-2 text-sm text-gray-700">Show Passwords</span>
          </label>
        </div>
        <button
          onClick={handlePasswordUpdate}
          className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
          disabled={loadingPassword}
        >
          {loadingPassword ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}