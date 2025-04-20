// GymPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../appwrite/Admin';
import { motion } from 'framer-motion';

function GymPage() {
  const { gymId } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (!gymId) {
      console.error('No gym ID found in URL');
      setLoading(false);
      return;
    }

    const fetchGym = async () => {
      try {
        const res = await adminService.getGym(gymId);
        setGym(res);
      } catch (err) {
        console.error('Error fetching gym: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGym();
  }, [gymId]);

  const handleApplyTrainer = () => {
    navigate(`/trainer_application/${gymId}`);
  };

  const handleJoinGym = () => {
    navigate(`/gym_plans/${gymId}`);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-white">Loading gym information...</p>
    );
  if (!gym)
    return (
      <p className="text-center mt-10 text-lg text-red-500">Gym not found.</p>
    );

  return (
    <div className=' min-h-screen'>
      <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl  mx-auto p-8 bg-gray-900 text-white rounded-xl shadow-2xl mt-8 border border-pink-600"
    >
      <h1 className="text-4xl font-bold text-pink-500 mb-6 text-center">{gym.gymName}</h1>

      <div className="space-y-4 text-gray-300">
        <p>
          <span className="font-semibold text-white">Admin Email:</span> {gym.adminEmail}
        </p>
        <p>
          <span className="font-semibold text-white">Address:</span> {gym.gymAddress}
        </p>
        <p>
          <span className="font-semibold text-white">Description:</span> {gym.gymDescription}
        </p>
      </div>

      {role === 'trainer' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyTrainer}
          className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md text-lg font-medium transition-all"
        >
          Apply as Trainer
        </motion.button>
      )}

      {role === 'user' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleJoinGym}
          className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-lg font-medium transition-all"
        >
          Join Gym
        </motion.button>
      )}
    </motion.div>
    </div>
  );
}

export default GymPage;