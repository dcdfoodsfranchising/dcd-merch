import React from "react";

export default function ProfileDetails({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  mobileNo,
  handleSaveDetails,
  loadingDetails,
}) {
  return (
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
  );
}