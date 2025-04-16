// pages/EditPlan.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminService from '../../appwrite/Admin';
import { PlanForm } from '../../../Index'; // adjust if path is different


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
    <div className="py-8">
      
        <PlanForm plan={plan} />
      
    </div>
  ) : null;
}

export default EditPlan;
