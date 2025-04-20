import React from 'react';
import { motion } from 'framer-motion';

function PlanCard({ title, description, price, duration, onUpdate, onDelete, onBuy, isBought }) {
  const role = localStorage.getItem('role');

  return (
    <motion.div
      className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 w-full max-w-sm flex flex-col justify-between"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-grow">
        <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mb-1">₹{price}</p>
        <p className="text-base text-gray-600 font-medium mb-4">{duration}</p>
        <p className="text-sm text-gray-700">{description}</p>
      </div>

      <div className="mt-6 flex gap-3 flex-wrap">
        {role === 'admin' ? (
          <>
            <button
              onClick={onUpdate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Update
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Delete
            </button>
          </>
        ) : (
          <button
            onClick={isBought ? null : onBuy}
            disabled={isBought}
            className={`flex-1 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors ${
              isBought
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isBought ? 'Bought' : 'Book Now'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default PlanCard;
