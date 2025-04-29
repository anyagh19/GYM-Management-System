import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PlanCard } from '../../Index';
import adminService from '../appwrite/Admin';
import memberService from '../appwrite/Member';

function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  // Fetch plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await adminService.listAllPlan();
        if (response?.documents) {
          setPlans(response.documents);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        toast.error("Failed to fetch plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle plan purchase
  const handleBuy = async (plan) => {
    if (!userData) {
      toast.error("Please login to purchase a plan.");
      return navigate('/login');
    }

    try {
      let memberDocID = await memberService.getMemberDocIDByUserID(userData.$id);

      const registrationDate = new Date().toISOString();
      const expiryDate = new Date(Date.now() + plan.duration * 30 * 24 * 60 * 60 * 1000).toISOString();

      

      const bookingPayload = {
        userName: userData.name,
        userEmail: userData.email,
        userPhone: userData.phone ?? '',
        userAddress: userData.address ?? '',
        userID: userData.$id,
        planID: plan.$id,
        title: plan.title,
        price: String(plan.price),
        registrationDate,
        expiryDate,
      };
      console.log("📦 Booking payload being sent:", bookingPayload);

      // Create or update member plan
      if (!memberDocID) {
        await memberService.createMember({
          ...bookingPayload,
          userPassword: userData.password ?? '',
        });
      } else {
        await memberService.updateMemberPlan(memberDocID, plan.$id, plan.duration * 30);
      }

      await memberService.bookingHistory(bookingPayload);

      toast.success(`🎉 Successfully bought ${plan.title} plan!`);
      navigate('/member');
    } catch (err) {
      console.error("❌ Error buying plan:", err);
      toast.error("Failed to purchase plan. Please try again.");
    }
  };

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 p-10">
      {loading ? (
        <div className="col-span-3 text-center">Loading plans...</div>
      ) : (
        plans.map((plan) => (
          <div key={plan.$id}>
            <PlanCard
              title={plan.title}
              description={plan.description}
              price={`${plan.price}`}
              duration={`${plan.duration} Month`}
              onBuy={() => handleBuy(plan)}
              // Add onUpdate, onDelete if needed for updating and deleting plans
            />
          </div>
        ))
      )}
    </div>
  );
}

export default PlansPage;
