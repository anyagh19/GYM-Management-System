import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { attendanceService } from "../../appwrite/Attendence"; // Adjust path as needed
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


function AttendancePage() {
  const [attendance, setAttendance] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData); // Adjust based on your redux structure

  useEffect(() => {
    if (userData) {
      const fetchAttendanceHistory = async () => {
        try {
          const history = await attendanceService.getAttendanceHistory(userData.$id);
          setAttendanceHistory(history);
        } catch (err) {
          console.error("Error fetching attendance history:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAttendanceHistory();
    } else {
      setLoading(false);
    }
  }, [userData]);

  const handleMarkAttendance = async (attended) => {
    if (!userData) return;
    try {
      await attendanceService.markAttendance(userData.$id, attended);
      setAttendance(attended);
      const updatedHistory = await attendanceService.getAttendanceHistory(userData.$id);
      setAttendanceHistory(updatedHistory);
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  const getTileClassName = ({ date, view }) => {
    if (view === "month") {
      const iso = date.toISOString().split("T")[0]; // Convert date to ISO format
      const entry = attendanceHistory.find((e) => e.date === iso);
      if (entry && entry.attended) {
        return "present-day"; // Add 'present-day' class for attended days
      }
    }
    return null;
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
    <div className="p-10">
      <h2 className="text-3xl font-semibold text-center mb-10">My Gym Attendance</h2>

      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Mark Today's Attendance</h2>
        <div className="flex justify-center">
          <button
            onClick={() => handleMarkAttendance(true)}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
          >
            Mark Attended
          </button>
          <button
            onClick={() => handleMarkAttendance(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Mark Absent
          </button>
        </div>
      </div>

      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Attendance Calendar</h2>
        <div className="flex justify-center">
          <Calendar
            tileClassName={getTileClassName} // Use the function to get tile class for attended dates
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{formatDate(entry.date)}</td>
                <td className="px-4 py-2 border-b">{entry.attended ? "Present" : "Absent"}</td>
              </tr>
            ))}
          </tbody>
            </table>
      </div>
    </div>
    
  );
}

export default AttendancePage;
