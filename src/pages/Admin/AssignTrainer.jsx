import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "../../appwrite/Admin";
import { motion } from "framer-motion";

function AssignTrainer() {
  const { userID, gymID } = useParams();
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await adminService.listGymTrainers(gymID);
        if (res?.documents && res.documents.length > 0) {
          setTrainers(res.documents);
        } else {
          setTrainers([]);
        }
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };
    fetchTrainers();
  }, [gymID]);

  const handleAssign = async (trainerID) => {
    try {
      await adminService.assignTrainerToMember({ gymID, userID, trainerID });
      alert("Trainer assigned successfully!");
    } catch (error) {
      console.error("Error assigning trainer:", error);
      alert("Failed to assign trainer.");
    }
  };

  return (
    <div className="min-h-screen">
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-5xl mx-auto bg-gray-900 text-white rounded-lg shadow-2xl mt-10"
    >
      <h2 className="text-3xl font-bold mb-6 text-pink-500 text-center">
        Assign Trainer
      </h2>

      {trainers.length === 0 ? (
        <p className="text-center text-gray-400">No registered trainers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-md overflow-hidden">
            <thead className="bg-pink-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Trainer ID</th>
                <th className="py-3 px-4 text-left">Trainer Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <motion.tr
                  key={trainer.$id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="py-3 px-4">{trainer.trainerID}</td>
                  <td className="py-3 px-4">{trainer.name}</td>
                  <td className="py-3 px-4">{trainer.email}</td>
                  <td className="py-3 px-4">{trainer.phone}</td>
                  <td className="py-3 px-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAssign(trainer.trainerID)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Assign
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
    </div>
  );
}

export default AssignTrainer;
