import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import memberService from "../../appwrite/Member";
import { Card } from "../../../Index";
import authService from "../../appwrite/Auth";
import { motion } from "framer-motion";

function WorkoutPage() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const user = await authService.getCurrentUser();
        const userID = user.$id;
        const res = await memberService.getWorkoutPlan(userID);
        console.log("Workout Plan Response:", res);
        if (res?.plan) {
          const parsedPlan = JSON.parse(res.plan);
          setWorkoutPlan({ ...res, parsedPlan });
        }
      } catch (err) {
        console.error("Failed to fetch workout plan", err);
        setError("Could not fetch workout plan.");
      }
    };

    fetchWorkout();
  }, []);

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-center sm:text-left text-blue-600">
          Workout Plan
        </h2>
        <Link
          to="/attendance"
          className="text-blue-600 hover:underline text-sm mt-2 sm:mt-0"
        >
          View Attendance
        </Link>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {!workoutPlan && !error && (
        <p className="text-gray-500 animate-pulse text-center">
          Loading workout plan...
        </p>
      )}

      {workoutPlan && (
        <motion.div
          className="mb-4 bg-blue-50 p-4 rounded-lg shadow"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="font-semibold text-blue-700">Goal</h4>
          <p className="text-gray-700 mt-1">{workoutPlan.goal}</p>
        </motion.div>
      )}

      {workoutPlan && (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {Object.entries(workoutPlan.parsedPlan).map(([day, workout]) => (
            <motion.div
              key={day}
              className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-bold text-blue-600 mb-2">{day}</h3>
              <p className="text-gray-700 whitespace-pre-line">{workout}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {workoutPlan?.note && (
        <motion.div
          className="mt-6 bg-blue-50 p-4 rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-semibold text-blue-700">Trainer Notes</h4>
          <p className="text-gray-700 mt-2 whitespace-pre-line">
            {workoutPlan.note}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default WorkoutPage;