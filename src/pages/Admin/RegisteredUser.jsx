import React, { useState, useEffect } from 'react';
import adminService from '../../appwrite/Admin';
import { useNavigate } from 'react-router-dom';
import memberService from '../../appwrite/Member';

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
      }
    };
    fetchUsers();
  }, []);

  const handleAssignTrainer = (userID) => {
    const gymID = users.find(user => user.userID === userID)?.gymID; 
    console.log("Assigning trainer to user:", userID, "at gym:", gymID);
    navigate(`/assign_trainer/${userID}/${gymID}`);
  };

  const handleDeleteUser = async (userID) => {
    try {
      await memberService.deleteMember(userID); // Assuming you have a deleteUser method in adminService
      setUsers(users.filter(user => user.$id !== userID)); // Update the users list after deletion
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Error deleting user.");
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-2xl font-bold'>Registered Users</h1>
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
              <th className='py-2 px-4'>Assign Trainer</th> {/* New column for the button */}
              <th className='py-2 px-4'>Delete</th> {/* Delete column */}
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
                <td className='py-2 px-4'>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => handleAssignTrainer(user.userID)}
                  >
                    Assign Trainer
                  </button>
                </td>
                <td className='py-2 px-4'>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() => handleDeleteUser(user.$id)} // Trigger delete user logic
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RegisteredUser;
