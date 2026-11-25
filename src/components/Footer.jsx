import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-white font-bold mb-2">ShopSphere</h3>
          <p className="text-sm">Your one-stop shop, built with the MERN stack.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm space-y-1">
            <li>About Us</li>
            <li>Contact</li>
            <li>Return Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Support</h4>
          <p className="text-sm">support@shopsphere.com</p>
        </div>
      </div>
      <div className="text-center text-xs py-4 border-t border-gray-700">
        &copy; {new Date().getFullYear()} ShopSphere. All rights reserved.
      </div>
    </footer>
  );
}
