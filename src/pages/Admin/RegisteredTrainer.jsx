import React, { useEffect, useState } from 'react';
import adminService from '../../appwrite/Admin';
import authService from '../../appwrite/Auth';
import { motion } from 'framer-motion';

function RegisteredTrainer() {
  const [trainers, setTrainers] = useState([]);


  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const adminID = currentUser?.$id;

        const gyms = await adminService.listGyms();
        const gym = gyms.documents.find(g => g.adminID === adminID);
        const gymID = gym?.gymID;

        if (!gymID) return console.error("Gym not found for admin.");

        const res = await adminService.listTrainers();
        if(res.documents && res.documents.length > 0)
        {
          setTrainers(res.documents || []);
        }
       
      } catch (error) {
        console.error("Error fetching trainers: ", error);
      }
    };

    fetchTrainers();
  }, []);

  const handleDelete = async (trainerId) => {
    try {
      await adminService.deleteTrainer(trainerId);
      setTrainers(prev => prev.filter(trainer => trainer.$id !== trainerId));
      alert("Trainer deleted successfully.");
    } catch (error) {
      console.error("Error deleting trainer:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Registered Trainers</h2>

        {trainers.length === 0 ? (
          <p className="text-center text-gray-400">No registered trainers found.</p>
        ) : (
          <>
            {/* Table view for md and up */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-sm text-sm md:text-base">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Qualifications</th>
                    <th className="py-3 px-4">Specialization</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map((trainer) => (
                    <motion.tr
                      key={trainer.$id}
                      whileHover={{ scale: 1.01 }}
                      className="text-center border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="py-2 px-4">{trainer.name}</td>
                      <td className="py-2 px-4">{trainer.email}</td>
                      <td className="py-2 px-4">{trainer.phone}</td>
                      <td className="py-2 px-4">{trainer.qualification}</td>
                      <td className="py-2 px-4">{trainer.specialization}</td>
                      <td className="py-2 px-4">{trainer.experience}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleDelete(trainer.$id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card view for mobile */}
            <div className="block md:hidden space-y-4">
              {trainers.map((trainer, index) => (
                <motion.div
                  key={trainer.$id}
                  className="bg-gray-800 p-4 rounded-lg shadow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <p><span className="text-blue-400 font-semibold">Name:</span> {trainer.name}</p>
                  <p><span className="text-blue-400 font-semibold">Email:</span> {trainer.email}</p>
                  <p><span className="text-blue-400 font-semibold">Phone:</span> {trainer.phone}</p>
                  <p><span className="text-blue-400 font-semibold">Address:</span> {trainer.address}</p>
                  <div className="mt-3">
                    <button
                      onClick={() => handleDelete(trainer.$id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default RegisteredTrainer;
