import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { trainerService } from "../../appwrite/Trainer";
import authService from "../../appwrite/Auth";
import { useParams } from "react-router-dom";
import { Input } from "../../../Index"; // Adjust path if needed

function SetDietPlan() {
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

      // Set the food plan in a day-wise format
      const foodPlan = {
        Monday: data.Monday,
        Tuesday: data.Tuesday,
        Wednesday: data.Wednesday,
        Thursday: data.Thursday,
        Friday: data.Friday,
        Saturday: data.Saturday,
        Sunday: data.Sunday,
      };

      await trainerService.setDietPlan({
        userID,
        trainerID,
        goal: data.goal,
        calories: data.calories,
        protein: data.protein,
        waterInTake: data.waterInTake,
        food: JSON.stringify(foodPlan),  // Day-wise food plan
        note: data.note,
      });

      setSuccess(true);
      reset(); // Clear the form after submission
    } catch (err) {
      console.error(err);
      setError("Failed to submit diet plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-4">
      <h2 className="text-2xl font-semibold mb-4">Set Diet Plan</h2>
      {success && <p className="text-green-600">Diet plan submitted successfully!</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
        <Input
          label="Goal"
          placeholder="e.g., Weight Loss"
          {...register("goal", { required: "Goal is required" })}
          className="border p-2 rounded"
        />
        {errors.goal && <p className="text-red-500 text-sm">{errors.goal.message}</p>}

        <Input
          label="Calories"
          type="number"
          placeholder="Calories"
          {...register("calories", { required: "Calories are required" })}
          className="border p-2 rounded"
        />
        {errors.calories && <p className="text-red-500 text-sm">{errors.calories.message}</p>}

        <Input
          label="Protein (g)"
          type="number"
          placeholder="Protein"
          {...register("protein", { required: "Protein intake is required" })}
          className="border p-2 rounded"
        />
        {errors.protein && <p className="text-red-500 text-sm">{errors.protein.message}</p>}

        <Input
          label="Water Intake"
          type="text"
          placeholder="e.g., 3L"
          {...register("waterInTake", { required: "Water intake is required" })}
          className="border p-2 rounded"
        />
        {errors.waterInTake && <p className="text-red-500 text-sm">{errors.waterInTake.message}</p>}

        {/* Day-wise Food Plan */}
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
          <Input
            key={day}
            label={`${day}'s Food Plan`}
            placeholder={`e.g., Breakfast, Lunch, Dinner for ${day}`}
            {...register(day, { required: `${day} food plan is required` })}
            className="border p-2 rounded"
          />
        ))}

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
          {loading ? "Submitting..." : "Submit Diet Plan"}
        </button>
      </form>
    </div>
  );
}

export default SetDietPlan;
