import React from "react";

import { Link, useNavigate } from "react-router-dom";

const data = [
    { title: "registeres User",url:'/registered_user',  color: "bg-blue-600" },
    { title: "Trainers",url:'/registered_trainer', color: "bg-green-600" },
    //{ title: " Trainer Applications",url:'/applications_for_trainer',  color: "bg-blue-400" },
    { title: "Total Packages", url:'/total_packages' ,   color: "bg-red-600" },
    
    { title: "Booking History",url:'/booking_history' , color: "bg-green-500" },
    { title: "Feedback and Reports",url:'/feedback' , color: "bg-green-500" },
    // { title: "Partial Payment Booking", count: 0, color: "bg-yellow-500" },
    // { title: "Full Payment Booking", count: 0, color: "bg-red-700" },
  ];
const AdminDash = () => {
    const navigate = useNavigate()
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4 font-bold text-lg border-b text-center">GYM MANAGEMENT</div>
        <ul className="p-4 space-y-2 text-gray-700">
          <li className="font-semibold text-blue-600">Dashboard</li>
          {/* <li>Category</li>
          <li>Package Type</li> */}
          <li>
            <Link to='/total_packages'>
            Pacakges
            </Link>
          </li>
          {/* <li>Booking History</li> */}
          <li><Link to='/registered_user'>
          Registered User
          </Link></li>
          <li><Link to='/registered_trainer'>
          Trainers
          </Link></li>
          {/* <li><Link to='/applications_for_trainer'>
          Trainer Applications
          </Link></li> */}
          <li>
            <Link to='/booking_history'>
            Booking History
            </Link>
          </li>
          <li>
            <Link to='/feedback'>
            feedback & reports
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4">
        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <div className={`text-white text-xl font-bold p-4 rounded ${item.color}`}>
                {item.count}
              </div>
              <div className="mt-3 text-gray-800 font-semibold">{item.title}</div>
              <button className="mt-4 text-sm bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
              onClick={() => navigate(item.url)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
};

export default AdminDash;
