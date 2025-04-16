import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import adminService from '../appwrite/Admin';
import authService from '../appwrite/Auth';
import memberService from '../appwrite/Member'; // 👈 Import your memberService
import { PlanCard } from '../../Index';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function GymPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { adminID } = useParams();
  const [gymDocID, setGymDocID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const gyms = await adminService.listGyms();
        const gym = gyms.documents.find(g => g.$id === adminID);

        if (!gym) {
          toast.error("Gym not found for this admin.");
          setLoading(false);
          return;
        }

        const gymID = gym.gymID;
        setGymDocID(gymID);

        const response = await adminService.listPlans(gymID);
        setPlans(response?.documents || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Error fetching gym plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [adminID]);

  const handleBuyPlan = async (plan) => {
    try {
      const user = await authService.getCurrentUser();

      console.log("Current User Data:", user.$id);
      if (!user) {
        toast.error("Please log in to buy a plan.");
        return;
      }

      const registrationDate = new Date().toISOString();
      const expiryDate = new Date(Date.now() + plan.duration * 30 * 24 * 60 * 60 * 1000).toISOString(); // approx 30 days/month

      const checkExistingPlan = await memberService.getMemberPlan(user.$id);
      if (checkExistingPlan) {
        toast.error("You already have an active plan.");
        console.log("Existing Plan:", checkExistingPlan);
        return;
      }
      await memberService.createMember({
        userName: user.name,
        userEmail: user.email,
        userPassword: '', // only if needed, or skip this
        userPhone: '', // get from profile if you store it
        userAddress: '', // same here
        userID: user.$id,
        planID: plan.$id,
        title: plan.title,
        registrationDate,
        expiryDate,
        gymID: gymDocID,
      });

      await memberService.bookingHistory({
        userName: user.name,
        userEmail: user.email,
        
        userPhone: '', // get from profile if you store it
        userAddress: '', // same here
        userID: user.$id,
        planID: plan.$id,
        title: plan.title,
        registrationDate,
        expiryDate,
        gymID: gymDocID,
      })

      toast.success("Plan booked successfully!");
      navigate('/member')
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Failed to book the plan.");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {loading ? (
        <p className="text-center py-10">Loading Plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-center text-lg">No plans available for this gym.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 p-10">
          {plans.map((plan) => (
            <PlanCard
              key={plan.$id}
              title={plan.title}
              description={plan.description}
              price={`${plan.price}`}
              duration={`${plan.duration} Months`}
              onBuy={() => handleBuyPlan(plan)} // 👈 pass onBuy handler
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default GymPlans;
