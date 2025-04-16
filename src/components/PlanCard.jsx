import React from 'react';

function PlanCard({ title, description, price, duration, onUpdate, onDelete, onBuy, isBought }) {
  const role = localStorage.getItem('role'); // 'Admin' or 'user'

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm flex flex-col justify-between">
      <div>
        <h3 className="text-md text-red-600 font-semibold mb-1">{title}</h3>
        <p className="text-2xl font-bold mb-1">₹{price}</p>
        <p className="text-lg font-semibold text-gray-700 mb-4">{duration}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="mt-6 flex gap-3">
        {role === 'admin' ? (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={onUpdate}
            >
              Update
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={onDelete}
            >
              Delete
            </button>
          </>
        ) : (
          <button
            className={`text-white px-4 py-2 rounded ${isBought ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
            onClick={isBought ? null : onBuy} // Disable button if already bought
            disabled={isBought}
          >
            {isBought ? 'Bought' : 'Booking Now'}
          </button>
        )}
      </div>
    </div>
  );
}

export default PlanCard;
