import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { trainerService } from "../../appwrite/Trainer";
import authService from "../../appwrite/Auth";
import { useParams } from "react-router-dom";
import { Input } from "../../../Index"; // Adjust path if needed
import { motion } from "framer-motion";

function SetWorkoutPlan() {
  const { userID } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const trainer = await authService.getCurrentUser();
      const trainerID = trainer.$id;

      await trainerService.setWorkoutPlan({
        userID,
        trainerID,
        goal: data.goal,
        daysPerWeek: data.daysPerWeek,
        plan: JSON.stringify({
          Monday: data.Monday,
          Tuesday: data.Tuesday,
          Wednesday: data.Wednesday,
          Thursday: data.Thursday,
          Friday: data.Friday,
          Saturday: data.Saturday,
          Sunday: data.Sunday,
        }),
        note: data.note,
      });

      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
      setError("Failed to submit workout plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-xl rounded-lg mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-600"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Set Workout Plan
      </motion.h2>

      {success && (
        <motion.p
          className="text-green-600 text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Workout plan submitted successfully!
        </motion.p>
      )}

      {error && (
        <motion.p
          className="text-red-600 text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
        <Input
          label="Goal"
          placeholder="e.g., Muscle Gain"
          {...register("goal", { required: "Goal is required" })}
          className="border p-2 rounded w-full"
        />
        {errors.goal && <p className="text-red-500 text-sm">{errors.goal.message}</p>}

        <Input
          label="Days per Week"
          type="number"
          placeholder="e.g., 5"
          {...register("daysPerWeek", {
            required: "Days per week is required",
            min: {
              value: 1,
              message: "Minimum 1 day required",
            },
            max: {
              value: 7,
              message: "Maximum 7 days allowed",
            },
          })}
          className="border p-2 rounded w-full"
        />
        {errors.daysPerWeek && (
          <p className="text-red-500 text-sm">{errors.daysPerWeek.message}</p>
        )}

        {/* Day-wise plan */}
        <div className="grid grid-cols-1 gap-4 mt-2">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
            (day) => (
              <Input
                key={day}
                label={`${day}'s Plan`}
                placeholder={`e.g., ${
                  day === "Wednesday" || day === "Sunday" ? "Rest" : "Push Day"
                }`}
                {...register(day, { required: `${day} plan is required` })}
                className="border p-2 rounded w-full"
              />
            )
          )}
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            {...register("note")}
            placeholder="Optional notes..."
            rows={3}
            className="border w-full p-2 rounded resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 px-4 rounded mt-4 w-full"
        >
          {loading ? "Submitting..." : "Submit Workout Plan"}
        </button>
      </form>
    </motion.div>
  );
}

export default SetWorkoutPlan;
