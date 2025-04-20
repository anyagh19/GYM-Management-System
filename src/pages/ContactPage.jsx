import React from 'react';
import { motion } from 'framer-motion';

function ContactPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-10 md:px-12 max-w-5xl mx-auto"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-center text-[#007b55] mb-8">
        Contact Us
      </h1>

      <p className="mb-6 text-gray-700 text-lg leading-relaxed text-center">
        We’d love to hear from you! Whether you have questions about gym memberships, platform features, 
        or need support — we're here to help you on your fitness journey.
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white shadow-md rounded-xl p-6 md:p-8"
      >
        <div className="space-y-4 text-gray-800 text-base md:text-lg">
          <div>
            <p className="font-semibold text-[#007b55]">🏢 Captain Gym</p>
            <p>Kedgaon, Near Kedgaon Railway Station, Daund, Pune – 412203</p>
          </div>
          <div>
            <p className="font-semibold text-[#007b55]">📞 Phone</p>
            <p>+91 99756 41896</p>
          </div>
          <div>
            <p className="font-semibold text-[#007b55]">📧 Email</p>
            <p>captaingym@1828gmail.com</p>
          </div>
          <div>
            <p className="font-semibold text-[#007b55]">🕒 Operating Hours</p>
            <p>
              Monday – Saturday: 6:00 AM – 10:00 PM<br />
              Sunday: 7:00 AM – 12:00 PM
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ContactPage;
