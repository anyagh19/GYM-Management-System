import React, { useEffect, useState } from "react";
import adminService from "../../appwrite/Admin";
import authService from "../../appwrite/Auth";
import { motion } from "framer-motion";

function BookingHistory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = await authService.getCurrentUser();
        const adminID = user.$id;
        const gyms = await adminService.listGyms();
        const gym = gyms.documents.find(g => g.adminID === adminID);
        if (!gym?.gymID) return;

        const response = await adminService.bookinHistoryOfGym(gym.gymID);
        if (response?.documents) {
          setUsers(response.documents);
        }
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">Booking History</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400">No booking records found.</p>
        ) : (
          <>
            {/* Table for medium and larger screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-gray-800 text-sm md:text-base rounded-lg overflow-hidden shadow">
                <thead className="bg-gray-700 text-gray-300">
                  <tr>
                    <th className="py-3 px-4">User ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Registered</th>
                    <th className="py-3 px-4">Expiry</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.$id}
                      className="border-b border-gray-700 hover:bg-gray-700 text-center"
                    >
                      <td className="py-2 px-4">{user.userID}</td>
                      <td className="py-2 px-4">{user.userName}</td>
                      <td className="py-2 px-4">{user.userEmail}</td>
                      <td className="py-2 px-4">{user.userPhone}</td>
                      <td className="py-2 px-4">{new Date(user.registrationDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{new Date(user.expiryDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{user.title}</td>
                      <td className="py-2 px-4">₹{user.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card layout */}
            <div className="block md:hidden space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.$id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800 p-4 rounded-lg shadow text-sm"
                >
                  <p><span className="text-blue-400 font-semibold">User ID:</span> {user.userID}</p>
                  <p><span className="text-blue-400 font-semibold">Name:</span> {user.userName}</p>
                  <p><span className="text-blue-400 font-semibold">Email:</span> {user.userEmail}</p>
                  <p><span className="text-blue-400 font-semibold">Phone:</span> {user.userPhone}</p>
                  <p><span className="text-blue-400 font-semibold">Registered:</span> {new Date(user.registrationDate).toLocaleDateString()}</p>
                  <p><span className="text-blue-400 font-semibold">Expiry:</span> {new Date(user.expiryDate).toLocaleDateString()}</p>
                  <p><span className="text-blue-400 font-semibold">Plan:</span> {user.title}</p>
                  <p><span className="text-blue-400 font-semibold">Price:</span> ₹{user.price}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default BookingHistory;
