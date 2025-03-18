export default function ProfileDropdown({ onOrdersClick, onLogoutClick }) {
    return (
      <div className="absolute right-0 mt-28 w-40 bg-white shadow-md rounded-lg py-2">
        <button
          onClick={onOrdersClick}
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          My Orders
        </button>
        <button
          onClick={onLogoutClick}
          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    );
  }
  