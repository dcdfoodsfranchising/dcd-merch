import React, { useState, useEffect } from "react";
import { getUserDetails, updateUsername, updatePassword, uploadProfilePicture } from "../services/userService";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user details on component mount
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);
        setUsername(userDetails.username);
      } catch (error) {
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleUsernameUpdate = async () => {
    try {
      setLoading(true);
      await updateUsername(username);
      toast.success("Username updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to update username.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      setLoading(true);
      await updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    try {
      setLoading(true);
      const file = e.target.files[0];
      if (!file) return;

      const response = await uploadProfilePicture(file);
      setUser((prev) => ({ ...prev, profilePicture: response.profilePicture }));
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error(error || "Failed to upload profile picture.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* Profile Picture */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Profile Picture</h2>
        <div className="flex items-center space-x-4">
          <img
            src={user.profilePicture || "/assets/icons/profile.svg"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="text-sm"
          />
        </div>
      </div>

      {/* Username */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Username</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-sm"
        />
        <button
          onClick={handleUsernameUpdate}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          Update Username
        </button>
      </div>

      {/* Password */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-sm mb-2"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md text-sm"
        />
        <button
          onClick={handlePasswordUpdate}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          Update Password
        </button>
      </div>

      {/* Current Details */}
      <div>
        <h2 className="text-lg font-medium mb-2">Current Details</h2>
        <p className="text-sm text-gray-600">Email: {user.email}</p>
        <p className="text-sm text-gray-600">Username: {user.username}</p>
      </div>
    </div>
  );
}