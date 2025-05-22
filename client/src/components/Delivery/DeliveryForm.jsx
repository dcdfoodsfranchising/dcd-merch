import React, { useEffect } from 'react';

const initialForm = {
  firstName: '',
  lastName: '',
  contactNumber: '',
  barangay: '',
  city: '',
  postalCode: '',
  completeAddress: '',
  tag: '',
  notesForRider: '',
};

const DeliveryForm = React.memo(
  ({
    formData,
    handleChange,
    handleSubmit,
    isEditMode,
    setFormData,
    formErrors = {},
  }) => {
    // Always reset to empty fields if not editing
    useEffect(() => {
      if (!isEditMode && setFormData) {
        setFormData(initialForm);
      }
      // eslint-disable-next-line
    }, [isEditMode]);

    return (
      <div>
        <h2 className="text-xl text-slate-900 font-semibold mb-6">Delivery Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <label className="text-sm text-slate-900 font-medium block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter First Name"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
              {formErrors.firstName && (
                <div className="text-xs text-red-600 mt-1">{formErrors.firstName}</div>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-900 font-medium block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter Last Name"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
              {formErrors.lastName && (
                <div className="text-xs text-red-600 mt-1">{formErrors.lastName}</div>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-900 font-medium block mb-2">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                placeholder="Enter Contact Number"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
              {formErrors.contactNumber && (
                <div className="text-xs text-red-600 mt-1">{formErrors.contactNumber}</div>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-900 font-medium block mb-2">Barangay</label>
              <input
                type="text"
                name="barangay"
                value={formData.barangay}
                onChange={handleChange}
                required
                placeholder="Enter Barangay"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
              {formErrors.barangay && (
                <div className="text-xs text-red-600 mt-1">{formErrors.barangay}</div>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-900 font-medium block mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Enter City"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
              {formErrors.city && (
                <div className="text-xs text-red-600 mt-1">{formErrors.city}</div>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-900 font-medium block mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                placeholder="Enter Postal Code"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
              {formErrors.postalCode && (
                <div className="text-xs text-red-600 mt-1">{formErrors.postalCode}</div>
              )}
            </div>
            <div className="lg:col-span-2">
              <label className="text-sm text-slate-900 font-medium block mb-2">Complete Address</label>
              <input
                type="text"
                name="completeAddress"
                value={formData.completeAddress}
                onChange={handleChange}
                required
                placeholder="Enter Complete Address"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
              {formErrors.completeAddress && (
                <div className="text-xs text-red-600 mt-1">{formErrors.completeAddress}</div>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-900 font-medium block mb-2">Tag</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                placeholder="e.g. Home, Office"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
            </div>
            <div>
              <label className="text-sm text-slate-900 font-medium block mb-2">Notes for Rider</label>
              <input
                type="text"
                name="notesForRider"
                value={formData.notesForRider}
                onChange={handleChange}
                placeholder="Optional notes for rider"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-red-600"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
);

export default DeliveryForm;