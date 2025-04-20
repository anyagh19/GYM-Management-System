import React from "react";
import { motion } from "framer-motion";


const quotes = [
  "Push yourself because no one else is going to do it for you.",
  "No pain, no gain!",
  "Success starts with self-discipline.",
  "Don't stop when you're tired. Stop when you're done.",
  "Train insane or remain the same."
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between ">
      {/* Quotes Marquee */}
      <div className="overflow-hidden whitespace-nowrap border-b border-gray-700 py-4 bg-gray-900">
        <motion.div
          className="inline-block"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          {quotes.map((quote, index) => (
            <span key={index} className="mx-8 text-xl font-semibold text-white">
              {quote}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4">Welcome to Gym Management System</h1>
          <p className="text-lg max-w-xl mx-auto">
            Unleash your potential and achieve your fitness goals with us. Top-tier equipment,
            expert trainers, and a community that drives you forward.
          </p>
        </motion.div>
      </div>

      {/* Footer */}
     
    </div>
  );
};

export default HomePage;