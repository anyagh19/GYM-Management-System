import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../store/AuthSlice';
import authService from '../appwrite/Auth';
import { Logo, Input, Button, Select } from '../../Index.js'
import { ID } from 'appwrite';
import trainerService from '../appwrite/Trainer.jsx';

function SignUp() {
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    reset(); // clear previous form input
  };

  const create = async (data) => {
    setError('');
    try {
      if (selectedRole === 'admin') {
        const userData = await authService.createAccount({
          adminID: ID.unique(),
          adminEmail: data.adminEmail,
          adminPassword: data.adminPassword,
          adminName: data.adminName,
          role: selectedRole,
          gymName: data.gymName || '',
          gymAddress: data.gymAddress || '',
          gymDescription: data.gymDescription || '',
          gymImages: '' // add file/image input later if needed
        });
        if (userData) {
          const currentUserData = await authService.getCurrentUser(userData);

          dispatch(login({ userData: currentUserData }));
          toast.success('🎉 Signup successful!', { position: 'top-center' });
          navigate('/admin');
        }


      }
        if (selectedRole === 'trainer') {
          const userData = await trainerService.createTrainer({
            trainerID: ID.unique(),
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            role: selectedRole
          })

          if (userData) {
            const currentUserData = await authService.getCurrentUser(userData);
            dispatch(login({ userData: currentUserData }));
            toast.success('🎉 Signup successful!', { position: 'top-center' });
            navigate('/trainer');
          }
          // dispatch(login({ userData: currentUserData }));
          // toast.success('🎉 Signup successful!', { position: 'top-center' });
          //   if (selectedRole === 'admin') {
          //     navigate('/admin');
          //   }
          //   else if (selectedRole === 'member') {
          //     navigate('/member');
          //   }
          //   else if (selectedRole === 'trainer') {
          //     navigate('/trainer');
          //   }
          // }
        }
      
    } catch (error) {
      setError(error.message);
      toast.error('❌ Signup failed. Try again.', { position: 'top-center' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex justify-center items-center p-6">
      <div className="flex flex-col bg-white py-10 px-10 gap-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center">
          <Logo />
          <p className="mt-2 font-semibold text-gray-600">Sign up as:</p>
          <div className="flex justify-center gap-3 mt-2">
            {['admin', 'member', 'trainer'].map(role => (
              <button
                key={role}
                onClick={() => handleRoleSelect(role)}
                className={`px-4 py-2 rounded-md border ${selectedRole === role ? 'bg-[#007b55] text-white' : 'bg-gray-100 text-gray-700'
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
            <form onSubmit={handleSubmit(create)} className="flex flex-col gap-5">
              {/* <Input
                type="email"
                placeholder="Enter email"
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                {...register('email', { required: true })}
              />
              <Input
                type="password"
                placeholder="Enter password"
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                {...register('password', { required: true })}
              />
              <Input
                type="text"
                placeholder="Enter name"
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                {...register('name', { required: true })}
              /> */}

              {selectedRole === 'trainer' && (
                <>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('email', { required: true })}
                  />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('password', { required: true })}
                  />
                  <Input
                    type="text"
                    placeholder="Enter name"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('name', { required: true })}
                  />
                  <Input
                    type="text"
                    placeholder="address"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('address', { required: true })}
                  />
                  <Input
                    type="text"
                    placeholder="phone"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('phone', { required: true })}
                  />
                  <Select
                    label="Gender"
                    options={['male', 'female', 'other']}
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('gender', { required: true })}
                  />

                </>
              )}

              {/* {selectedRole === 'member' && (
                <>
                  <Input
                    type="text"
                    placeholder="Age"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('age', { required: true })}
                  />
                  <Input
                    type="text"
                    placeholder="Preferred Time Slot"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('preferredTime', { required: true })}
                  />
                </>
              )} */}

              {selectedRole === 'admin' && (
                <>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('adminEmail', { required: true })}
                  />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('adminPassword', { required: true })}
                  />
                  <Input
                    type="text"
                    placeholder="Enter name"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('adminName', { required: true })}
                  />
                  <Input
                    type="text"
                    placeholder="Gym Name"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('gymName', { required: true })}
                  />
                  <Input
                    type="text"
                    placeholder="Gym Address"
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md focus:ring-[#007b55]"
                    {...register('gymAddress', { required: true })}
                  />
                  <textarea
                    placeholder="Gym Description"
                    {...register('description', { required: true })}
                    className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-md resize-none focus:ring-[#007b55]"
                    rows={3}
                  />
                </>
              )}


              <Link to="/login" className="text-lg font-medium text-[#007b55] hover:underline text-center">
                Already have an account?
              </Link>

              <Button type="submit" className="bg-[#007b55] hover:bg-[#005a3c] text-white py-3 rounded-md text-lg font-medium">
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
