// GymCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

function GymCard({ gymName, adminEmail, address, description, onJoin }) {
  const role = localStorage.getItem('role'); // 'admin' or 'user'

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="bg-gray-800 shadow-2xl rounded-2xl p-6 w-full max-w-md flex flex-col justify-between text-white border border-pink-500 hover:border-pink-400 transition-all duration-300"
    >
      <div>
        <h2 className="text-2xl font-bold text-pink-500 mb-2">{gymName}</h2>
        <p className="text-sm text-gray-300 mb-1">
          <span className="font-semibold text-white">Admin Email:</span> {adminEmail}
        </p>
        <p className="text-sm text-gray-300 mb-1">
          <span className="font-semibold text-white">Address:</span> {address}
        </p>
        <p className="text-sm text-gray-400 mt-4">{description}</p>
      </div>

      {role !== 'admin' && (
        <div className="mt-6">
          <button
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg w-full transition-all duration-300"
            onClick={onJoin}
          >
            View Gym
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default GymCard;
