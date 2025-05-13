import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { PlanCard } from '../../Index';
import adminService from '../appwrite/Admin';
import memberService from '../appwrite/Member';
import authService from '../appwrite/Auth';

const RAZORPAY_KEY_ID = 'rzp_test_kxwK4KltT9lbKS';

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

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle plan purchase with payment
  const handleBuy = async (plan) => {
    if (!userData) {
      toast.error("Please login to purchase a plan.");
      return navigate('/login');
    }

    try {
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded) {
        toast.error("Razorpay SDK failed to load. Are you online?");
        return;
      }

      const userID = userData.$id;
      const registrationDate = new Date().toISOString();
      const expiryDate = new Date(Date.now() + plan.duration * 30 * 24 * 60 * 60 * 1000).toISOString();

      const bookingPayload = {
        userName: userData.name,
        userEmail: userData.email,
        userPhone: userData.phone ?? '',
        userAddress: userData.address ?? '',
        userID: userID,
        planID: plan.$id,
        title: plan.title,
        price: String(plan.price),
        registrationDate,
        expiryDate,
      };

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: plan.price * 100, // Convert to paise
        currency: 'INR',
        name: 'Gym Management System',
        description: `Purchase ${plan.title} Plan`,
        image: '/logo.png',
        handler: async (response) => {
          try {
            let memberDocID = await memberService.getMemberDocIDByUserID(userID);

            // Create or update member plan
            if (!memberDocID) {
              await memberService.createMember({
                ...bookingPayload,
                userPassword: userData.password ?? '',
              });
            } else {
              await memberService.updateMemberPlan(memberDocID, plan.$id, plan.duration * 30);
            }

            // Record booking history
            await memberService.bookingHistory(bookingPayload);

            toast.success(`🎉 Successfully purchased ${plan.title} plan!`);
            navigate('/member');
          } catch (err) {
            console.error("❌ Error processing booking:", err);
            toast.error("Failed to complete booking. Please try again.");
          }
        },
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone ?? '',
        },
        notes: {
          address: userData.address ?? '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("❌ Error initiating payment:", err);
      toast.error("Failed to initiate payment. Please try again.");
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
            />
          </div>
        ))
      )}
    </div>
  );
}

export default PlansPage;
