import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const SavedAddresses = React.memo(({ deliveryDetails, selectedAddressId, handleRadioChange, handleEdit, handleDelete, maxAddresses }) => (
  <div>
    <h3 className="text-lg font-medium mb-2">Saved Addresses</h3>
    {deliveryDetails.length > 0 ? (
      <div className="grid gap-4 md:grid-cols-2">
        {deliveryDetails.slice(0, maxAddresses).map(address => (
          <div key={address._id} className="bg-white shadow border border-gray-200 p-4 flex flex-col justify-between">
            <div className="flex items-start gap-2">
              {deliveryDetails.length > 1 && (
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddressId === address._id}
                  onChange={() => handleRadioChange(address._id)}
                  className="mt-1 accent-red-700"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{address.firstName} {address.lastName}</p>
                <p className="text-sm">{address.contactNumber}</p>
                <p className="text-sm">{address.completeAddress}</p>
                <p className="text-xs text-gray-500">{address.barangay}, {address.city}, {address.postalCode}</p>
                {address.tag && <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-xs text-gray-700">{address.tag}</span>}
                {address.notesForRider && <div className="text-xs text-gray-400 mt-1">Note: {address.notesForRider}</div>}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(address)}
                className="flex-1 px-3 py-2 bg-red-700 text-white hover:bg-red-800 text-sm font-medium flex items-center justify-center gap-1 uppercase tracking-wide rounded"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(address._id)}
                className="flex-1 px-3 py-2 bg-red-700 text-white hover:bg-red-800 text-sm font-medium flex items-center justify-center gap-1 uppercase tracking-wide rounded"
                disabled={deliveryDetails.length === 1}
                title={deliveryDetails.length === 1 ? "At least one address required" : ""}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white shadow border border-gray-200 p-4 text-center text-gray-500">
        No delivery address saved yet.
      </div>
    )}
  </div>
));

export default SavedAddresses;