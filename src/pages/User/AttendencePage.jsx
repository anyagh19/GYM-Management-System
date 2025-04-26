import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { attendanceService } from "../../appwrite/Attendence";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";

function AttendancePage() {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      return;
    }

    const fetchAttendance = async () => {
      try {
        const userAttendance = await attendanceService.getAttendanceHistory(userData.$id);

        if (userAttendance && Array.isArray(userAttendance.documents)) {
          setAttendanceHistory(userAttendance.documents);
        } else if (Array.isArray(userAttendance)) {
          setAttendanceHistory(userAttendance);
        } else {
          setAttendanceHistory([]);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [userData]);

  const handleMarkAttendance = async (attended) => {
    if (!userData) return;
    try {
      await attendanceService.markAttendance(userData.$id, attended, userData.prefs.role , userData.name); // fixed here
      const updatedHistory = await attendanceService.getAttendanceHistory(userData.$id);

      if (updatedHistory && Array.isArray(updatedHistory.documents)) {
        setAttendanceHistory(updatedHistory.documents);
      } else if (Array.isArray(updatedHistory)) {
        setAttendanceHistory(updatedHistory);
      } else {
        setAttendanceHistory([]);
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading attendance...</div>;
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-10">
        My Gym Attendance
      </h2>

      {userData.prefs.role !== "admin" && (
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-2">Mark Today's Attendance</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
            <button
              onClick={() => handleMarkAttendance(true)}
              className="bg-green-500 hover:bg-green-600 transition text-white px-6 py-2 rounded"
            >
              Mark Attended
            </button>
            <button
              onClick={() => handleMarkAttendance(false)}
              className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded"
            >
              Mark Absent
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">
          Attendance History
        </h2>

        {/* Normal user: Show their own history */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Role</th> {/* NEW COLUMN */}
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{formatDate(entry.date)}</td>
                  <td className="px-4 py-2 border-b">
                    {entry.attended ? (
                      <span className="text-green-600 font-medium">Present</span>
                    ) : (
                      <span className="text-red-500 font-medium">Absent</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b capitalize">{entry.role || "user"}</td> {/* show role */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AttendancePage;
