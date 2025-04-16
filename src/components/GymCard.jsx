import React from 'react';

function GymCard({ gymName, adminEmail, address, description, onJoin }) {
  const role = localStorage.getItem('role'); // 'admin' or 'user'

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-2">{gymName}</h2>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Admin Email:</span> {adminEmail}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-semibold">Address:</span> {address}
        </p>
        <p className="text-sm text-gray-700 mt-4">{description}</p>
      </div>

      {role !== 'admin' && (
        <div className="mt-6">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
            onClick={onJoin}
          >
            view Gym
          </button>
        </div>
      )}
    </div>
  );
}

export default GymCard;
