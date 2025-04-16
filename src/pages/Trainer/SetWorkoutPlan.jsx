import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { trainerService } from "../../appwrite/Trainer";
import authService from "../../appwrite/Auth";
import { useParams } from "react-router-dom";
import { Input } from "../../../Index"; // Adjust path as needed

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

    //   const plan = {
    //     Monday: data.Monday,
    //     Tuesday: data.Tuesday,
    //     Wednesday: data.Wednesday,
    //     Thursday: data.Thursday,
    //     Friday: data.Friday,
    //     Saturday: data.Saturday,
    //     Sunday: data.Sunday,
    //   };

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
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-4">
      <h2 className="text-2xl font-semibold mb-4">Set Workout Plan</h2>
      {success && <p className="text-green-600">Workout plan submitted successfully!</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
        <Input
          label="Goal"
          placeholder="e.g., Muscle Gain"
          {...register("goal", { required: "Goal is required" })}
          className="border p-2 rounded"
        />
        {errors.goal && <p className="text-red-500 text-sm">{errors.goal.message}</p>}

        <Input
          label="Days per Week"
          type="number"
          placeholder="e.g., 5"
          {...register("daysPerWeek", {
            required: "Days per week is required",
            min: 1,
            max: 7,
          })}
          className="border p-2 rounded"
        />
        {errors.daysPerWeek && <p className="text-red-500 text-sm">{errors.daysPerWeek.message}</p>}

        {/* Day-wise Plan */}
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
          (day) => (
            <Input
              key={day}
              label={`${day}'s Plan`}
              placeholder={`e.g., ${day === "Wednesday" || day === "Sunday" ? "Rest" : "Workout"}`}
              {...register(day, { required: `${day} plan is required` })}
              className="border p-2 rounded"
            />
          )
        )}

        {/* Notes */}
        <div>
          <label className="inline-block font-medium text-gray-500">Additional Notes</label>
          <textarea
            {...register("note")}
            placeholder="Optional notes"
            rows={3}
            className="border w-full p-2 rounded resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Workout Plan"}
        </button>
      </form>
    </div>
  );
}

export default SetWorkoutPlan;
