import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminService from "../../appwrite/Admin";

function AssignTrainer() {
    const { userID, gymID } = useParams();
    console.log("User ID:", userID, "Gym ID:", gymID);
    const [loading, setLoading] = useState(true);
    const [trainers, setTrainers] = useState([]);

   
    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const res = await adminService.listGymTrainers(gymID)
                if (res?.documents && res.documents.length > 0) {
                    setTrainers(res.documents);
                }
                else{
                    setTrainers([]);
                }
            } catch{
                console.error("Error fetching trainers:", error);
            }
        }
        fetchTrainers();
    },[gymID])

    const handleAssign = async (trainerID) => {
        try {
            // Assign the trainer to the member
            console.log("Assigning trainer:", trainerID, "to member:", userID, "at gym:", gymID);
            await adminService.assignTrainerToMember( {gymID, userID, trainerID});
            alert("Trainer assigned successfully!");
        } catch (error) {
            console.error("Error assigning trainer:", error);
        }
    }
    // if (loading) return <div className="p-4">Loading...</div>;
    // if (!member) return <div className="p-4 text-red-500">Member not found.</div>;

    return (
        <div className="p-4">
            {/* <h2 className="text-2xl font-semibold mb-4">Assign Trainer to {member.name}</h2> */}

            {trainers.length === 0 ? (
                <div className="text-gray-600">No registered trainers found.</div>
            ) : (
                <table className="min-w-full bg-white shadow rounded">
                    <thead className="bg-gray-200">
                        <tr>
                        <th className="py-2 px-4 text-left">Trainer ID</th>
                            <th className="py-2 px-4 text-left">Trainer Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">Phone</th>
                            <th className="py-2 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainers.map((trainer) => (
                            <tr key={trainer.$id} className="border-t">
                                <td className="py-2 px-4">{trainer.trainerID}</td>
                                <td className="py-2 px-4">{trainer.name}</td>
                                <td className="py-2 px-4">{trainer.email}</td>
                                <td className="py-2 px-4">{trainer.phone}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleAssign(trainer.trainerID)}
                                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                                    >
                                        Assign
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AssignTrainer;
