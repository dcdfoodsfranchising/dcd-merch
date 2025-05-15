import React from "react";

export default function ProfilePicture({ profilePicture, handleProfilePictureUpload }) {
  return (
    <div className="w-full lg:w-1/3 flex-shrink-0 mb-6 lg:mb-0">
      <h2 className="text-lg font-medium mb-2">Profile Picture</h2>
      <div className="flex flex-col items-center">
        <img
          src={profilePicture || "/assets/icons/profile.svg"}
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
  );
}