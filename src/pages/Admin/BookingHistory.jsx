import { useEffect , useState } from "react";
import React from 'react'
import adminService from "../../appwrite/Admin";
import authService from "../../appwrite/Auth";

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
        console.log("Gym ID:", gym.gymID);
        const response = await adminService.bookinHistoryOfGym(gym.gymID);
        if (response?.documents && response.documents.length > 0) {
          setUsers(response.documents);
        }
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-2xl font-bold'>Booking History</h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
          <thead>
            <tr className='bg-gray-200 text-gray-700'>
              <th className='py-2 px-4'>User ID</th>
              <th className='py-2 px-4'>Name</th>
              <th className='py-2 px-4'>Email</th>
              <th className='py-2 px-4'>Phone</th>
              <th className='py-2 px-4'>Date Registered</th>
              <th className='py-2 px-4'>Expiry Date</th>
              <th className='py-2 px-4'>Plan title</th>
              <th className='py-2 px-4'>Plan price</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.$id} className='border-b hover:bg-gray-100'>
                <td className='py-2 px-4'>{user.userID}</td>
                <td className='py-2 px-4'>{user.userName}</td>
                <td className='py-2 px-4'>{user.userEmail}</td>
                <td className='py-2 px-4'>{user.userPhone}</td>
                <td className='py-2 px-4'>{new Date(user.registrationDate).toLocaleDateString()}</td>
                <td className='py-2 px-4'>{new Date(user.expiryDate).toLocaleDateString()}</td>
                <td className='py-2 px-4'>{user.title}</td>
                <td className='py-2 px-4'>{user.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BookingHistory