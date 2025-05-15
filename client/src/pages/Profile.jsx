import React, { useState, useEffect, Suspense, lazy } from "react";
import { getUserDetails, updateUserDetails, updatePassword, uploadProfilePicture } from "../services/userService";
import { toast } from "react-toastify";

const ProfileDetails = lazy(() => import("../components/Profile/ProfileDetails"));
const ProfilePicture = lazy(() => import("../components/Profile/ProfilePicture"));
const ProfileEmail = lazy(() => import("../components/Profile/ProfileEmail"));
const ProfilePassword = lazy(() => import("../components/Profile/ProfilePassword"));

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

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
    setPasswordError("");
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
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <Suspense fallback={<div>Loading profile...</div>}>
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start">
          <ProfileDetails
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            mobileNo={mobileNo}
            handleSaveDetails={handleSaveDetails}
            loadingDetails={loadingDetails}
          />
          <ProfilePicture
            profilePicture={user.profilePicture}
            handleProfilePictureUpload={handleProfilePictureUpload}
          />
        </div>
        <ProfileEmail email={email} />
        <ProfilePassword
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPasswords={showPasswords}
          setShowPasswords={setShowPasswords}
          passwordError={passwordError}
          handlePasswordUpdate={handlePasswordUpdate}
          loadingPassword={loadingPassword}
        />
      </Suspense>
    </div>
  );
}