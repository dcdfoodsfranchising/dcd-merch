import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Explore */}
        <div>
          <h3 className="text-lg font-bold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
            <li>
              <a href="/products" className="hover:underline">Products</a>
            </li>
            <li>
              <a href="/about" className="hover:underline">About Us</a>
            </li>
          </ul>
        </div>
        {/* Contacts */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contacts</h3>
          <ul className="space-y-2">
            <li>Email: <a href="mailto:info@dcdmerch.com" className="hover:underline">info@dcdmerch.com</a></li>
            <li>Phone: <a href="tel:+639123456789" className="hover:underline">+63 912 345 6789</a></li>
            <li>Facebook: <a href="https://facebook.com/dcdmerch" className="hover:underline" target="_blank" rel="noopener noreferrer">/dcdmerch</a></li>
          </ul>
        </div>
        {/* Legal */}
        <div>
          <h3 className="text-lg font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <a href="/terms" className="hover:underline">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
            </li>
            <li>
              <a href="/refund" className="hover:underline">Refund Policy</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} DelishCheese Dough. All rights reserved.
      </div>
    </footer>
  );
}