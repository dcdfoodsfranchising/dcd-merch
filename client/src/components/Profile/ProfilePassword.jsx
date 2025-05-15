import React from "react";

export default function ProfilePassword({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showPasswords,
  setShowPasswords,
  passwordError,
  handlePasswordUpdate,
  loadingPassword,
}) {
  return (
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
  );
}