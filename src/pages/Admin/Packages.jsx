import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../../appwrite/Admin';
import PlanCard from '../../components/PlanCard';
import { toast } from 'react-toastify';

function Packages() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData')) || null;

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const gyms = await adminService.listGyms();
                const adminGym = gyms.documents.find(gym => gym.adminID === userData.$id);

                if (!adminGym) {
                    toast.error("No gym found for this admin.");
                    return;
                }

                const response = await adminService.listPlans(adminGym.gymID);
                if (response?.documents) {
                    setPlans(response.documents);
                }
            } catch (error) {
                console.error("Error fetching plans:", error);
                toast.error("Failed to fetch plans.");
            } finally {
                setLoading(false);
            }
        };

        if (userData?.$id) fetchPlans();
    }, [userData]);

    const handleDelete = async (planId) => {
        try {
            await adminService.deletePlan(planId);
            toast.success('Plan deleted!');
            setPlans(plans.filter(p => p.$id !== planId));
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete plan');
        }
    };

    const handleUpdate = (plan) => {
        navigate(`/edit_plan/${plan.$id}`);
    };

    if (loading) return <p className="text-center py-10">Loading Plans...</p>;

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex justify-end px-10'>
                <Link to='/plan_form'>
                    <button className='bg-[#007b55] hover:bg-[#005a3c] text-white py-2 px-4 rounded-md my-5'>
                        Create Plan
                    </button>
                </Link>
            </div>

            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 p-10">
                {plans.map(plan => (
                    <PlanCard
                        key={plan.$id}
                        title={plan.title}
                        description={plan.description}
                        price={`${plan.price}`}
                        duration={`${plan.duration} Month`}
                        onUpdate={() => handleUpdate(plan)}
                        onDelete={() => handleDelete(plan.$id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Packages;
