import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../appwrite/Admin';
import authService from '../../appwrite/Auth';

function RegisteredTrainer() {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        const fetchTrainers = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                const adminID = currentUser?.$id;

                const gyms = await adminService.listGyms();
                const gym = gyms.documents.find(g => g.adminID === adminID);
                const gymID = gym?.gymID;

                if (!gymID) return console.error("Gym not found for admin.");

                const res = await adminService.listGymTrainers(gymID);
                setTrainers(res.documents);
            } catch (error) {
                console.error("Error fetching trainers: ", error);
            }
        };

        fetchTrainers();
    }, []);

    const handleDelete = async (trainerId) => {
        try {
            await adminService.deleteTrainerApplication(trainerId); // change to correct method if needed
            setTrainers(prev => prev.filter(trainer => trainer.$id !== trainerId));
        } catch (error) {
            console.error("Error deleting trainer:", error);
        }
    };

    return (
        <div className="p-4">
            {/* <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Registered Trainers</h2>
                <Link to='/assign_trainer' className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Assign Trainer
                </Link>
            </div> */}

            {trainers.length === 0 ? (
                <p>No registered trainers found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">Address</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainers.map((trainer) => (
                                <tr key={trainer.$id} className="text-center">
                                    <td className="py-2 px-4 border-b">{trainer.name}</td>
                                    <td className="py-2 px-4 border-b">{trainer.email}</td>
                                    <td className="py-2 px-4 border-b">{trainer.phone}</td>
                                    <td className="py-2 px-4 border-b">{trainer.address}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => handleDelete(trainer.$id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RegisteredTrainer;
