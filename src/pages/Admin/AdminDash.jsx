// src/pages/AdminDash.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDash = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 font-bold text-lg border-b text-center">GYM MANAGEMENT</div>
        <ul className="p-4 space-y-2 text-gray-700">
        <li><Link to="/admin">DashBoard</Link></li>
          <li><Link to="total_packages">Packages</Link></li>
          <li><Link to="registered_user">Registered User</Link></li>
          <li><Link to="registered_trainer">Trainers</Link></li>
          <li><Link to="applications_for_trainer">Trainer Applications</Link></li>
          <li><Link to="booking_history">Booking History</Link></li>
          <li><Link to="feedback">Feedback & Reports</Link></li>
          <li><Link to="atendence-history">Attendance History</Link></li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDash;
