import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import memberService from "../../appwrite/Member"; // Adjust the path to your actual file
import { Card } from "../../../Index"; // Adjust if using a custom Card or UI library
import authService from "../../appwrite/Auth"; 

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
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Workout Plan</h2>
        <Link
          to="/attendance"
          className="text-blue-600 hover:underline text-sm"
        >
          View Attendance
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {!workoutPlan && !error && (
        <p className="text-gray-500 animate-pulse">Loading workout plan...</p>
      )}

      {workoutPlan && (
        <div className="mb-4 bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700">Goal</h4>
          <p className="text-gray-600">{workoutPlan.goal}</p>
        </div>
      )}
      {workoutPlan && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(workoutPlan.parsedPlan).map(([day, workout]) => (
            <Card key={day} className="bg-white rounded-xl shadow p-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{day}</h3>
              <p className="text-gray-700 whitespace-pre-line">{workout}</p>
            </Card>
          ))}
        </div>
      )}

      {workoutPlan?.note && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700">Trainer Notes</h4>
          <p className="text-gray-600 mt-2 whitespace-pre-line">{workoutPlan.note}</p>
        </div>
      )}
    </div>
  );
}

export default WorkoutPage;
