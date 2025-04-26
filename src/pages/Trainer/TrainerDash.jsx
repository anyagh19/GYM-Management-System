import React, { useEffect, useState } from 'react';
import authService from '../../appwrite/Auth';
import memberService from '../../appwrite/Member';
import trainerService from '../../appwrite/Trainer';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function TrainerDash() {
  const [member, setMember] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const userData = await authService.getCurrentUser();
        const res = await trainerService.listAssignedUsers(userData.$id);
        const assignedUsers = res.documents.filter(user => user.trainerID === userData.$id);

        const memberPromises = assignedUsers.map(async (assignedUser) => {
          try {
            if (!assignedUser.userID) return null;
            const docID = await memberService.getMemberDocIDByUserID(assignedUser.userID);
            if (!docID) return null;
            const memberData = await memberService.getMember(docID);
            return memberData;
          } catch (error) {
            console.error(`Error fetching member with ID ${assignedUser.userID}:`, error);
            return null;
          }
        });

        const allMembers = await Promise.all(memberPromises);
        const validMembers = allMembers.filter(member => member !== null);
        setMember(validMembers);
      } catch (error) {
        console.error("Error fetching assigned users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  const handleDietPlan = (userID) => {
    navigate(`/set_diet_plan/${userID}`);
  };

  const handleWorkoutPlan = (userID) => {
    navigate(`/set_workout_plan/${userID}`);
  };

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-3xl font-bold text-pink-600 mb-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Trainer Dashboard
          
      </motion.h1>
      <Link to="/attendance">
          <h2 className='text-end mb-2'>Attendence</h2>
          </Link>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4">Member ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 animate-pulse">
                  Loading members...
                </td>
              </tr>
            ) : member.length > 0 ? (
              member.map((m) => (
                <motion.tr
                  key={m.userID}
                  className="border-t hover:bg-gray-50 transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="py-3 px-4">{m.userID}</td>
                  <td className="py-3 px-4">{m.userName}</td>
                  <td className="py-3 px-4">{m.userEmail}</td>
                  <td className="py-3 px-4">{m.userPhone}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleDietPlan(m.userID)}
                        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition"
                      >
                        Diet Plan
                      </button>
                      <button
                        onClick={() => handleWorkoutPlan(m.userID)}
                        className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700 transition"
                      >
                        Workout Plan
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-6 px-4 text-center text-gray-500">
                  No members assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid gap-4 mt-6">
        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading members...</p>
        ) : member.length > 0 ? (
          member.map((m) => (
            <motion.div
              key={m.userID}
              className="bg-white p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-700"><strong>ID:</strong> {m.userID}</p>
              <p className="text-sm text-gray-700"><strong>Name:</strong> {m.userName}</p>
              <p className="text-sm text-gray-700"><strong>Email:</strong> {m.userEmail}</p>
              <p className="text-sm text-gray-700"><strong>Phone:</strong> {m.userPhone}</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleDietPlan(m.userID)}
                  className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition w-full sm:w-auto"
                >
                  Diet Plan
                </button>
                <button
                  onClick={() => handleWorkoutPlan(m.userID)}
                  className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700 transition w-full sm:w-auto"
                >
                  Workout Plan
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No members assigned.</p>
        )}
      </div>
    </motion.div>
  );
}

export default TrainerDash;
