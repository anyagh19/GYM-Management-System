import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as storelogin } from '../store/AuthSlice';
import authService from '../appwrite/Auth';
import { Logo, Input, Button } from '../../Index.js';
import { motion } from 'framer-motion';

function LogIn() {
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const loginUser = async (data) => {
    setError('');
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          const role = userData.prefs?.role || 'user';
          dispatch(storelogin({ userData, role }));
          toast.success('🎉 Login successful', { position: 'top-center' });

          if (role === 'admin') navigate('/admin');
          else if (role === 'trainer') navigate('/trainer');
          else navigate('/member');
        }
      }
    } catch (error) {
      setError(error.message);
      toast.error('❌ Login failed! Check your credentials.', { position: 'top-center' });
    }
  };

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('https://i.pinimg.com/474x/38/1d/cf/381dcfd655a13c087370ad48543bdc5d.jpg')" }} // 👉 Replace with your image path
    >
      <motion.div
        className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-sm shadow-xl rounded-2xl p-8 sm:p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <Logo />
        </div>

        {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

        <form onSubmit={handleSubmit(loginUser)} className="flex flex-col gap-5">
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

          <Link to="/signup" className="text-sm text-center text-[#007b55] hover:underline font-medium">
            Don't have an account? Sign up
          </Link>

          <Button
            type="submit"
            className="bg-[#007b55] hover:bg-[#005a3c] text-white py-3 rounded-md text-lg font-semibold"
          >
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default LogIn;
