export default function LogoutModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-lg font-semibold text-center mb-4">Confirm Logout</h2>
          <p className="text-center text-gray-600 mb-4">Are you sure you want to log out?</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onConfirm} // ✅ Calls logout and closes the modal
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Yes, Logout
            </button>
            <button
              onClick={onClose} // ✅ Just closes the modal without logging out
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
  