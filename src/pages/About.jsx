import React from 'react';
import { motion } from 'framer-motion';

function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 py-10 md:px-12 max-w-5xl mx-auto"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-center text-[#007b55] mb-8">
        About GYM_X
      </h1>

      <p className="mb-6 text-gray-700 text-lg leading-relaxed">
        <strong>Gym_X</strong> is a smart, centralized platform created to connect gyms and fitness seekers on one unified hub. 
        Whether you're a gym owner looking to manage operations efficiently or a fitness enthusiast exploring membership plans — 
        we’ve got you covered.
      </p>

      <p className="mb-6 text-gray-700 text-lg leading-relaxed">
        Our system empowers <span className="font-semibold">gyms to register</span>, showcase their facilities, 
        and publish membership plans, while allowing <span className="font-semibold">members to browse gyms</span>, 
        track their health progress, and subscribe to customized plans — all through an intuitive and seamless experience.
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-6 bg-white shadow-md rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-[#007b55] mb-4">What Our Platform Offers:</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-800 text-base">
          <li>📱 Centralized gym discovery and comparison</li>
          <li>🔐 Secure online sign-ups, payments, and renewals</li>
          <li>📊 Personalized dashboards for gym members</li>
          <li>📅 Real-time schedule, trainer, and plan management</li>
          <li>💪 AI-based workout & BMI tracking features (coming soon)</li>
        </ul>
      </motion.div>

      <p className="mb-6 text-gray-700 text-lg leading-relaxed">
        We are committed to transforming the fitness experience with cutting-edge technology, seamless automation, and a community-first approach.
      </p>

      <p className="text-gray-700 text-lg leading-relaxed">
        Join <strong>Captain Gym</strong> and take charge of your fitness journey or grow your fitness business with tools built 
        for success. 🚀
      </p>
    </motion.div>
  );
}

export default About;
