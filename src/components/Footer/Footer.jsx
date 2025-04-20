import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 pt-10 pb-6 relative overflow-hidden">
      <div className="absolute -top-10 -left-10 w-80 h-80 bg-pink-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="max-w-7xl mx-auto px-4 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-white text-xl font-bold mb-4">Beast Mode Gym</h4>
            <p>Train hard, stay strong. Join the community that never quits.</p>
          </div>
          <div>
            <h4 className="text-white text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xl font-bold mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-pink-500 hover:text-white text-xl transition-colors"><FaFacebook /></a>
              <a href="#" className="text-pink-500 hover:text-white text-xl transition-colors"><FaInstagram /></a>
              <a href="#" className="text-pink-500 hover:text-white text-xl transition-colors"><FaTwitter /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Beast Mode Gym. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
