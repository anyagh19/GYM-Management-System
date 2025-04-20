import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
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

      const gyms = await adminService.listGyms();
      const adminGym = gyms.documents.find((gym) => gym.adminID === adminID);

      if (!adminGym) throw new Error('Gym not found for this admin.');

      const gymID = adminGym.gymID;

      await adminService.createPlan({
        ...data,
        gymID,
        price: parseInt(data.price),
        duration: parseInt(data.duration),
      });

      toast.success('✅ Plan created successfully!', { position: 'top-center' });
      reset();
    } catch (err) {
      console.error(err);
      setError('Failed to create plan. Please try again.');
      toast.error('❌ Failed to create plan.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 mt-10 mb-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-[#007b55] mb-6">
          Create Membership Plan
        </h2>

        {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Title"
              placeholder="Enter plan title"
              {...register('title', { required: true })}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Description"
              placeholder="Enter plan description"
              {...register('description', { required: true })}
            />
          </div>

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

          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="w-full bg-[#007b55] hover:bg-[#005a3c] transition duration-300 ease-in-out text-white py-3 rounded-xl text-lg font-semibold shadow-md"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default PlanForm;
