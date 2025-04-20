import React, { useEffect, useState } from 'react';
import adminService from '../../appwrite/Admin';
import authService from '../../appwrite/Auth';
import { ID } from 'appwrite';
import { motion } from 'framer-motion';

function ApplicationsForTrainer() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const userData = await authService.getCurrentUser();
        const accountID = userData.$id;

        const gyms = await adminService.listGyms();
        const gym = gyms.documents.find(g => g.adminID === accountID);
        if (!gym) return;

        const originalGymID = gym.gymID;
        const response = await adminService.listTrainerApplication(originalGymID);
        setApplications(response?.documents || []);
      } catch (error) {
        console.error("Error fetching applications: ", error);
      }
    };

    fetchApplications();
  }, []);

  const handleAccept = async (applicationId) => {
    try {
      const selectedApp = applications.find(app => app.$id === applicationId);
      if (!selectedApp) return;

      await adminService.createGymTrainer({
        gymTrainerID: ID.unique(),
        gymID: selectedApp.gymID,
        trainerID: selectedApp.trainerID,
        name: selectedApp.name,
        email: selectedApp.email,
        phone: selectedApp.phone,
        address: selectedApp.address,
      });

      await adminService.deleteTrainerApplication(applicationId);
      setApplications(prev => prev.filter(app => app.$id !== applicationId));
      alert("Trainer accepted successfully.");
    } catch (error) {
      console.error("Error accepting trainer application:", error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await adminService.deleteTrainerApplication(applicationId);
      setApplications(prev => prev.filter(app => app.$id !== applicationId));
      alert("Application rejected.");
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-pink-500 mb-6 text-center">Trainer Applications</h2>

        {applications.length === 0 ? (
          <p className="text-center text-lg text-gray-400">No applications available.</p>
        ) : (
          <>
            {/* Table for medium and larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg shadow-md text-sm md:text-base">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Qualification</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Specialization</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <motion.tr
                      key={app.$id}
                      whileHover={{ scale: 1.01 }}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      <td className="py-3 px-4">{app.name}</td>
                      <td className="py-3 px-4">{app.email}</td>
                      <td className="py-3 px-4">{app.phone}</td>
                      <td className="py-3 px-4">{app.qualification}</td>
                      <td className="py-3 px-4">{app.experience}</td>
                      <td className="py-3 px-4">{app.specialization}</td>
                      <td className="py-3 px-4 flex gap-2 flex-wrap justify-center">
                        <button
                          onClick={() => handleAccept(app.$id)}
                          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(app.$id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                        >
                          Reject
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card layout */}
            <div className="block md:hidden space-y-4">
              {applications.map((app, index) => (
                <motion.div
                  key={app.$id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 p-4 rounded-lg shadow"
                >
                  <p><span className="text-pink-400 font-semibold">Name:</span> {app.name}</p>
                  <p><span className="text-pink-400 font-semibold">Email:</span> {app.email}</p>
                  <p><span className="text-pink-400 font-semibold">Phone:</span> {app.phone}</p>
                  <p><span className="text-pink-400 font-semibold">Qualification:</span> {app.qualification}</p>
                  <p><span className="text-pink-400 font-semibold">Experience:</span> {app.experience}</p>
                  <p><span className="text-pink-400 font-semibold">Specialization:</span> {app.specialization}</p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button
                      onClick={() => handleAccept(app.$id)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded w-full"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(app.$id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded w-full"
                    >
                      Reject
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

export default ApplicationsForTrainer;
