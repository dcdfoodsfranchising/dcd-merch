import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function ProfileModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-3">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
        >
          <img src="/assets/icons/close.svg" className="w-8" alt="" />
        </button>

        <div className="pb-7 flex justify-center">
          <img src="/assets/logo/logo.png" className="w-36" alt="" />
        </div>


        {/* Show Login or Register Form */}
        {isLogin ? <Login onClose={onClose} /> : <Register onClose={onClose} />}

        {/* Toggle Between Login and Register */}
        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? (
            <>
              No account yet?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="text-red-600 cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsLogin(true)}
                className="text-700-600 cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
