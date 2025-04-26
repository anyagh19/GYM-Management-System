import React, { useState, useEffect } from "react";
import { attendanceService } from "../../appwrite/Attendence";
import { motion, AnimatePresence } from "framer-motion";

function AttendanceHistory() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchAllAttendance = async () => {
      try {
        const allAttendance = await attendanceService.getAllAttendance();
        setAttendanceRecords(allAttendance);
      } catch (err) {
        console.error("Error fetching all attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllAttendance();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="text-lg font-semibold text-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
        >
          Loading attendance...
        </motion.div>
      </div>
    );
  }

  const membersAttendance = attendanceRecords.filter((entry) => entry.role === "user");
  const trainersAttendance = attendanceRecords.filter((entry) => entry.role === "trainer");

  const getUniqueUsers = (data) => {
    const seen = new Map();
    data.forEach((entry) => {
      if (!seen.has(entry.userID)) {
        seen.set(entry.userID, entry);
      }
    });
    return Array.from(seen.values());
  };

  const uniqueMembers = getUniqueUsers(membersAttendance);
  const uniqueTrainers = getUniqueUsers(trainersAttendance);

  const userHistory = attendanceRecords.filter((entry) => entry.userID === selectedUserId);

  const handleRowClick = (userId) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  const renderTable = (data, title) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 w-full"
    >
      <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-700">
        {title}
      </h3>
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700">
              <th className="px-6 py-3 border-b">User ID</th>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Role</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <motion.tr
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRowClick(entry.userID)}
                className="hover:bg-blue-50 cursor-pointer transition-all"
              >
                <td className="px-6 py-4 border-b">{entry.userID}</td>
                <td className="px-6 py-4 border-b">{entry.name}</td>
                <td className="px-6 py-4 border-b capitalize">{entry.role}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 md:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-600 mb-12">
        Attendance Management (Admin View)
      </h2>

      <div className="grid gap-12">
        {renderTable(uniqueMembers, "Members")}
        {renderTable(uniqueTrainers, "Trainers / Staff")}
      </div>

      <AnimatePresence>
        {selectedUserId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="mt-12 bg-gray-50 p-6 md:p-10 rounded-xl shadow-xl"
          >
            <h4 className="text-2xl font-bold text-center text-indigo-600 mb-6">
              Attendance History for User ID: {selectedUserId}
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="px-6 py-3 border-b">Date</th>
                    <th className="px-6 py-3 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userHistory.map((record, idx) => (
                    <motion.tr
                      key={idx}
                      whileHover={{ backgroundColor: "#f1f5f9" }}
                      className="transition"
                    >
                      <td className="px-6 py-4 border-b">{formatDate(record.date)}</td>
                      <td className="px-6 py-4 border-b">
                        {record.attended ? (
                          <span className="text-green-600 font-semibold">Present</span>
                        ) : (
                          <span className="text-red-500 font-semibold">Absent</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AttendanceHistory;
