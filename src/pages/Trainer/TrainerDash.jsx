import React, { useEffect, useState } from 'react'
import authService from '../../appwrite/Auth'
import memberService from '../../appwrite/Member'
import trainerService from '../../appwrite/Trainer'
import { useNavigate } from 'react-router-dom'

function TrainerDash() {
  const [member, setMember] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const userData = await authService.getCurrentUser();
        console.log("Current User Data:", userData.$id);

        const res = await trainerService.listAssignedUsers(userData.$id);
        const assignedUsers = res.documents.filter(user => user.trainerID === userData.$id);

        console.log("Assigned Users:", assignedUsers);

        const memberPromises = assignedUsers.map(async (assignedUser) => {
          try {
            if (!assignedUser.userID) return null;
            console.log("Fetching member with ID:", assignedUser.userID);
            const docID = await memberService.getMemberDocIDByUserID(assignedUser.userID); // <-- use the correct document ID

            if (!docID) return null;

            const memberData = await memberService.getMember(docID);
            return memberData;
          } catch (error) {
            console.error(`Error fetching member with ID ${assignedUser.userID}:`, error);
            return null;
          }
        });

        const allMembers = await Promise.all(memberPromises);
        const validMembers = allMembers.filter(member => member !== null); // Remove failed ones
        setMember(validMembers);
        console.log("All Members Data:", validMembers);

      } catch (error) {
        console.error("Error fetching assigned users: ", error);
      }
    };

    fetchMember();
  }, []);


  const handleDietPlan = async (userID) => {
    console.log("Navigating to diet plan for user:", userID)
    navigate(`/set_diet_plan/${userID}`)
  }

  const handleWorkoutPlan = async (userID) => {
    navigate(`/set_workout_plan/${userID}`)
  }

  return (
    <div>
      <h1>Trainer Dashboard</h1>
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">member ID</th>
            <th className="py-2 px-4 text-left">member Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Phone</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {member.length > 0 ? (
            member
              .filter(m => m && m.userID) // ensure m is not null and has a userID
              .map((member) => (
                <tr key={member.userID} className="border-t">
                  <td className="py-2 px-4">{member.userID}</td>
                  <td className="py-2 px-4">{member.userName}</td>
                  <td className="py-2 px-4">{member.userEmail}</td>
                  <td className="py-2 px-4">{member.userPhone}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDietPlan(member.userID)}
                        className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
                      >
                        Diet Plan
                      </button>
                      <button
                        onClick={() => handleWorkoutPlan(member.userID)}
                        className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-purple-700"
                      >
                        Workout Plan
                      </button>
                    </div>

                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 px-4 text-center">No members assigned</td>
            </tr>
          )}

        </tbody>
      </table>
    </div>
  )
}

export default TrainerDash
