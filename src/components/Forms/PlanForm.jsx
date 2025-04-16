import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Input, Button } from '../../../Index';
import { AdminService } from '../../appwrite/Admin';
import authService from '../../appwrite/Auth';

const adminService = new AdminService();

function PlanForm() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      const adminID = currentUser.$id;

      // 🔍 Fetch gyms and find the current admin's gym
      const gyms = await adminService.listGyms();
      const adminGym = gyms.documents.find(gym => gym.adminID === adminID);

      if (!adminGym) throw new Error('Gym not found for this admin.');

      const gymID = adminGym.gymID;

      await adminService.createPlan({
        ...data,
        gymID,
        price: parseInt(data.price),
        duration: parseInt(data.duration),
      });

      toast.success('✅ Plan created successfully!', { position: 'top-center' });
      reset(); // clear form
    } catch (err) {
      console.error(err);
      setError('Failed to create plan. Please try again.');
      toast.error('❌ Failed to create plan.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create Membership Plan
      </h2>

      {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Title"
          placeholder="Enter plan title"
          {...register('title', { required: true })}
        />
        <Input
          label="Description"
          placeholder="Enter plan description"
          {...register('description', { required: true })}
        />
        <Input
          type="number"
          label="Price"
          placeholder="Enter price"
          {...register('price', { required: true })}
        />
        <Input
          type="number"
          label="Duration (in months)"
          placeholder="e.g. 3, 6, 12"
          {...register('duration', { required: true })}
        />

        <Button
          type="submit"
          className="bg-[#007b55] hover:bg-[#005a3c] text-white py-3 rounded-md text-lg font-medium"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Plan'}
        </Button>
      </form>
    </div>
  );
}

export default PlanForm;
