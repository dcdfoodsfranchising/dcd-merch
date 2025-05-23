import React from "react";

const CancelConfirmModal = ({ open, onClose, onConfirm, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
        <div className="mb-4 text-center text-black">{message}</div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-black font-semibold"
            onClick={onClose}
          >
            No
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white font-semibold"
            onClick={onConfirm}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmModal;