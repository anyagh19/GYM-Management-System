import React, { useState, useEffect } from 'react';
import adminService from '../../appwrite/Admin';
import memberService from '../../appwrite/Member';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function RegisteredUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminService.registeredUser();
        if (response?.documents && response.documents.length > 0) {
          setUsers(response.documents);
        }
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAssignTrainer = (userID) => {
    const gymID = users.find(user => user.userID === userID)?.gymID;
    navigate(`/assign_trainer/${userID}/${gymID}`);
  };

  const handleDeleteUser = async (userID) => {
    try {
      await memberService.deleteMember(userID);
      await adminService.deleteAssignTrainer(userID);
      setUsers(users.filter(user => user.$id !== userID));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Error deleting user.");
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-900 min-h-screen text-white scroll-smooth overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">Registered Users</h1>
      {loading ? (
        <p className="text-center text-gray-400">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-400">No registered users found.</p>
      ) : (
        <>
          {/* Table view for md and up */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-gray-800 shadow-lg rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-pink-600 text-white text-sm">
                  <th className='py-3 px-4'>User ID</th>
                  <th className='py-3 px-4'>Name</th>
                  <th className='py-3 px-4'>Email</th>
                  <th className='py-3 px-4'>Phone</th>
                  <th className='py-3 px-4'>Registered</th>
                  <th className='py-3 px-4'>Expiry</th>
                  <th className='py-3 px-4'>Plan</th>
                  <th className='py-3 px-4'>Assign Trainer</th>
                  <th className='py-3 px-4'>Delete</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.$id}
                    className='text-center border-b border-gray-700 hover:bg-gray-700 transition duration-200'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className='py-3 px-4'>{user.userID}</td>
                    <td className='py-3 px-4'>{user.userName}</td>
                    <td className='py-3 px-4'>{user.userEmail}</td>
                    <td className='py-3 px-4'>{user.userPhone}</td>
                    <td className='py-3 px-4'>{new Date(user.registrationDate).toLocaleDateString()}</td>
                    <td className='py-3 px-4'>{new Date(user.expiryDate).toLocaleDateString()}</td>
                    <td className='py-3 px-4'>{user.title}</td>
                    <td className='py-3 px-4'>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleAssignTrainer(user.userID)}
                      >
                        Assign
                      </motion.button>
                    </td>
                    <td className='py-3 px-4'>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => handleDeleteUser(user.$id)}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view for mobile */}
          <div className="block md:hidden space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user.$id}
                className="bg-gray-800 rounded-lg p-4 shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <p><span className="text-pink-400 font-semibold">Name:</span> {user.userName}</p>
                <p><span className="text-pink-400 font-semibold">Email:</span> {user.userEmail}</p>
                <p><span className="text-pink-400 font-semibold">Phone:</span> {user.userPhone}</p>
                <p><span className="text-pink-400 font-semibold">Registered:</span> {new Date(user.registrationDate).toLocaleDateString()}</p>
                <p><span className="text-pink-400 font-semibold">Expiry:</span> {new Date(user.expiryDate).toLocaleDateString()}</p>
                <p><span className="text-pink-400 font-semibold">Plan:</span> {user.title}</p>
                <div className="flex justify-between mt-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-md"
                    onClick={() => handleAssignTrainer(user.userID)}
                  >
                    Assign Trainer
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-md"
                    onClick={() => handleDeleteUser(user.$id)}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default RegisteredUser;
