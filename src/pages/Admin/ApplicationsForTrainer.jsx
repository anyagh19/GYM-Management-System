import React, { useEffect, useState } from 'react';
import adminService from '../../appwrite/Admin';
import authService from '../../appwrite/Auth';
import { ID } from 'appwrite';

function ApplicationsForTrainer() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const userData = await authService.getCurrentUser();
                const accountID = userData.$id;

                // Get all gyms
                const gyms = await adminService.listGyms();
                console.log("Gyms fetched: ", gyms.documents);


                // Find the gym owned by this user
                const gym = gyms.documents.find(g => g.adminID === accountID);


                if (!gym) {
                    console.error("Gym not found for this user.");
                    return;
                }

                // Use the custom gymID (like GYM_001)
                const originalGymID = gym.gymID;

                // Fetch applications for this gym
                const response = await adminService.listTrainerApplication(originalGymID);

                if (response?.documents?.length > 0) {
                    setApplications(response.documents);
                } else {
                    setApplications([]);
                }
            } catch (error) {
                console.error("Error fetching applications: ", error);
            }
        };

        fetchApplications();
    }, []);

    const handleAccept = async (applicationId) => {
        try {
            // Get the selected application data
            const selectedApp = applications.find(app => app.$id === applicationId);
            if (!selectedApp) {
                console.error("Application not found.");
                return;
            }
    
            // Create a GymTrainer entry
            await adminService.createGymTrainer({
                gymTrainerID: ID.unique(),
                gymID: selectedApp.gymID,
                trainerID: selectedApp.trainerID,
                name: selectedApp.name,
                email: selectedApp.email,
                phone: selectedApp.phone,
                address: selectedApp.address,
            });
    
            // Delete the application after accepting
            await adminService.deleteTrainerApplication(applicationId);
    
            // Remove from frontend list
            setApplications(prev => prev.filter(app => app.$id !== applicationId));
    
            console.log("Trainer accepted and moved to GymTrainer collection.");
        } catch (error) {
            console.error("Error accepting trainer application:", error);
        }
    };
    

    const handleReject = async (applicationId) => {
        try {
            await adminService.deleteTrainerApplication(applicationId);
            setApplications((prev) => prev.filter((app) => app.$id !== applicationId));
            console.log("Deleted application with ID:", applicationId);
        } catch (error) {
            console.error("Error rejecting (deleting) application:", error);
        }
    };
    

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-4">Trainer Applications</h2>

            {applications.length === 0 ? (
                <p className="text-center text-lg">No applications available.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 border-b">Name</th>
                            <th className="py-3 px-4 border-b">Email</th>
                            <th className="py-3 px-4 border-b">Phone</th>
                            <th className="py-3 px-4 border-b">Qualification</th>
                            <th className="py-3 px-4 border-b">Experience</th>
                            <th className="py-3 px-4 border-b">Specialization</th>
                            <th className="py-3 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application.$id} className="text-center">
                                <td className="py-3 px-4 border-b">{application.name}</td>
                                <td className="py-3 px-4 border-b">{application.email}</td>
                                <td className="py-3 px-4 border-b">{application.phone}</td>
                                <td className="py-3 px-4 border-b">{application.qualification}</td>
                                <td className="py-3 px-4 border-b">{application.experience}</td>
                                <td className="py-3 px-4 border-b">{application.specialization}</td>
                                <td className="py-3 px-4 border-b">
                                    <button
                                        onClick={() => handleAccept(application.$id)}
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md mr-2"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(application.$id)}
                                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                                    >
                                        Reject
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

export default ApplicationsForTrainer;
