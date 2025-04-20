import React, { useState, useEffect } from 'react';
import adminService from '../appwrite/Admin';
import GymCard from '../components/GymCard';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function GymCardPage() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const response = await adminService.listGyms();
        if (response?.documents?.length) {
          setGyms(response.documents);
        }
      } catch (error) {
        console.error('Error fetching gyms: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGyms();
  }, []);

  const handleJoin = (gymId) => {
    navigate(`/gyms/${gymId}`);
  };

  return (
    <motion.div
      className="min-h-screen bg-white text-gray-800 px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-bold text-center mb-10 text-pink-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Explore Gyms
      </motion.h1>

      {loading ? (
        <motion.p
          className="text-center text-gray-400 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading gyms...
        </motion.p>
      ) : gyms.length === 0 ? (
        <motion.p
          className="text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No gyms available.
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {gyms.map((gym) => (
            <motion.div
              key={gym.$id}
              className="hover:scale-[1.02] transition-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GymCard
                gymName={gym.gymName}
                adminEmail={gym.adminEmail}
                address={gym.gymAddress}
                description={gym.gymDescription}
                onJoin={() => handleJoin(gym.$id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default GymCardPage;
