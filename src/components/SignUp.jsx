import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../store/AuthSlice';
import authService from '../appwrite/Auth';
import trainerService from '../appwrite/Trainer.jsx';
import { Logo, Input, Button, Select } from '../../Index.js';
import { ID } from 'appwrite';

function SignUp() {
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    reset();
  };

  const create = async (data) => {
    setError('');
    try {
      let userData;

      if (selectedRole === 'trainer') {
        userData = await trainerService.createTrainerApplication({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          qualification: data.qualification,
          experience: data.experience,
          specialization: data.specialization,
          address: data.address,
          gender: data.gender,
          role: selectedRole,
        });
      }

      if (selectedRole === 'member') {
        userData = await authService.createAccount({
          memberID: ID.unique(),
          email: data.email,
          password: data.password,
          name: data.name,
          phone: data.phone,
          address: data.address,
          role: selectedRole,
        });
      }

      if (userData) {
        const currentUserData = await authService.getCurrentUser();
        dispatch(
          login({
            userData: {
              ...currentUserData,
              role: currentUserData.prefs.role || 'member',
            },
            role: currentUserData.prefs.role || 'member',
          })
        );

        toast.success('🎉 Signup successful!', { position: 'top-center' });

        if (selectedRole === 'admin') navigate('/admin');
        else if (selectedRole === 'trainer') navigate('/trainer');
        else navigate('/member');
      }
    } catch (error) {
      setError(error.message);
      toast.error('❌ Signup failed. Try again.', { position: 'top-center' });
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex justify-center items-center p-6"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/474x/05/31/d7/0531d71e81f5a24dc74889d6c01b6523.jpg')",
      }}
    >
      <div className="flex flex-col bg-white/90 py-10 px-10 gap-6 rounded-3xl shadow-2xl w-full max-w-xl backdrop-blur-md animate-fade-in">
        <div className="text-center">
          <Logo />
          <p className="mt-2 font-semibold text-gray-700 text-lg">Sign up as:</p>
          <div className="flex justify-center gap-3 mt-3">
            {['member', 'trainer'].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`px-4 py-2 rounded-md border transition-all duration-300 ${
                  selectedRole === role
                    ? 'bg-[#007b55] text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-[#e0f2f1]'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {selectedRole && (
          <>
            {error && <p className="text-red-500 text-center font-medium">{error}</p>}
            <form onSubmit={handleSubmit(create)} className="flex flex-col gap-4">
              {(selectedRole === 'trainer' || selectedRole === 'member') && (
                <>
                  {/* Email */}
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register('email', {
                      required: 'Email is required',
                      validate: (value) =>
                        value.includes('.com') || 'Email must include ".com"',
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}

                  {/* Password */}
                  <Input
                    type="password"
                    placeholder="Password"
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}

                  {/* Name */}
                  <Input
                    type="text"
                    placeholder="Full Name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}

                  {/* Phone */}
                  <Input
                    type="text"
                    placeholder="Phone"
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Phone number must contain only numbers',
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </>
              )}

              {selectedRole === 'member' && (
                <>
                  <Input
                    type="text"
                    placeholder="Address"
                    {...register('address', { required: 'Address is required' })}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address.message}</p>
                  )}
                </>
              )}

              {selectedRole === 'trainer' && (
                <>
                  <Select
                    label="Gender"
                    options={['male', 'female', 'other']}
                    {...register('gender', { required: 'Gender is required' })}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender.message}</p>
                  )}

                  <Input
                    type="text"
                    placeholder="Qualification"
                    {...register('qualification', {
                      required: 'Qualification is required',
                    })}
                  />
                  {errors.qualification && (
                    <p className="text-red-500 text-sm">{errors.qualification.message}</p>
                  )}

                  <Input
                    type="text"
                    placeholder="Experience"
                    {...register('experience', {
                      required: 'Experience is required',
                    })}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm">{errors.experience.message}</p>
                  )}

                  <Input
                    type="text"
                    placeholder="Specialization"
                    {...register('specialization', {
                      required: 'Specialization is required',
                    })}
                  />
                  {errors.specialization && (
                    <p className="text-red-500 text-sm">{errors.specialization.message}</p>
                  )}
                </>
              )}

              <Link
                to="/login"
                className="text-center text-sm text-[#007b55] hover:underline"
              >
                Already have an account?
              </Link>

              <Button
                type="submit"
                className="bg-[#007b55] hover:bg-[#005a3c] text-white py-3 rounded-md text-lg font-semibold transition duration-300"
              >
                Sign Up as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SignUp;
