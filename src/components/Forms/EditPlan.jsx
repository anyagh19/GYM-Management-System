import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import adminService from '../../appwrite/Admin';
import { PlanForm } from '../../../Index'; // adjust path if needed

function EditPlan() {
  const [plan, setPlan] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      adminService.getPlan(id).then((plan) => {
        if (plan) setPlan(plan);
        else navigate('/');
      });
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  return plan ? (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold text-center text-[#007b55] mb-6">
          Edit Membership Plan
        </h2>

        <PlanForm plan={plan} isEditing />
      </motion.div>
    </div>
  ) : null;
}

export default EditPlan;
