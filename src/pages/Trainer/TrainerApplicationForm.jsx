import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Button, Input } from '../../../Index'; // Adjust paths accordingly
import { TrainerService } from '../../appwrite/Trainer';
import authService from '../../appwrite/Auth';
import { Client, ID, Storage } from "appwrite";
import conf from "../../conf/conf";
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const trainerService = new TrainerService();

function TrainerApplicationForm() {
  const { gymId } = useParams();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const storage = new Storage(new Client().setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectID));

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);

    try {
      const currentUser = await authService.getCurrentUser();
      const trainerID = currentUser.$id;

      const gymDoc = await trainerService.getGym(gymId);
      const originalGymID = gymDoc.gymID;

      let profilePic = '';

      if (file) {
        const fileUpload = await storage.createFile(conf.appwriteStorageBucketID, ID.unique(), file);
        profilePic = fileUpload.$id;
      }

      await trainerService.createTrainerApplication({
        ...data,
        trainerID,
        gymID: originalGymID,
        profilePic,
        price: parseInt(data.price),
        duration: parseInt(data.duration),
      });

      toast.success('✅ Trainer application submitted successfully!', { position: 'top-center' });
      reset();
    } catch (err) {
      console.error(err);
      setError('Failed to submit application. Please try again.');
      toast.error('❌ Failed to submit application.', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setValue('profilePic', selectedFile.name);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 sm:p-8 mt-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Trainer Application Form
      </motion.h2>

      {error && (
        <motion.p
          className="text-red-500 text-center font-medium mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5">
        <Input
          label="Name"
          placeholder="Enter your full name"
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
              message: 'Invalid email address',
            },
          })}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <Input
          type="text"
          label="Phone"
          placeholder="Enter your phone number"
          {...register('phone', { required: 'Phone is required' })}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

        {/* Profile Picture Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm border rounded-md px-3 py-2"
            {...register('profilePic', { required: 'Profile picture is required' })}
          />
          {errors.profilePic && <p className="text-red-500 text-sm">{errors.profilePic.message}</p>}
        </div>

        <Input
          label="Qualification"
          placeholder="Enter your qualification"
          {...register('qualification', { required: 'Qualification is required' })}
        />
        {errors.qualification && <p className="text-red-500 text-sm">{errors.qualification.message}</p>}

        <Input
          type="number"
          label="Experience (Years)"
          placeholder="Enter your years of experience"
          {...register('experience', { required: 'Experience is required' })}
        />
        {errors.experience && <p className="text-red-500 text-sm">{errors.experience.message}</p>}

        <Input
          label="Specialization"
          placeholder="e.g., Yoga, Strength Training"
          {...register('specialization', { required: 'Specialization is required' })}
        />
        {errors.specialization && <p className="text-red-500 text-sm">{errors.specialization.message}</p>}

        {/* Optional: Price and Duration (if used in your backend) */}
        <Input
          type="number"
          label="Price (₹)"
          placeholder="Enter your session price"
          {...register('price', { required: 'Price is required' })}
        />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

        <Input
          type="number"
          label="Duration (Minutes)"
          placeholder="Enter session duration"
          {...register('duration', { required: 'Duration is required' })}
        />
        {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}

        <Button
          type="submit"
          className="bg-[#007b55] hover:bg-[#005a3c] text-white py-3 rounded-md text-lg font-semibold"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </motion.div>
  );
}

export default TrainerApplicationForm;
