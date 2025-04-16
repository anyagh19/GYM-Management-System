import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import memberService from "../../appwrite/Member"; // Adjust the path to your actual file
import { Card } from "../../../Index"; // Adjust if using a custom Card or UI library
import authService from "../../appwrite/Auth";

function DietPage() {
    const [dietPlan, setDietPlan] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDiet = async () => {
            try {
                const user = await authService.getCurrentUser();
                const userID = user.$id;
                const res = await memberService.getDietPlan(userID);
                console.log("Diet Plan Response:", res);

                if (res?.food) {
                    const parsedPlan = JSON.parse(res.food);
                    setDietPlan({ ...res, parsedPlan });
                }
            } catch (err) {
                console.error("Failed to fetch diet plan", err);
                setError("Could not fetch diet plan.");
            }
        };

        fetchDiet();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Diet Plan</h2>
                {/* <Link
                    to="/attendance"
                    className="text-blue-600 hover:underline text-sm"
                >
                    View Attendance
                </Link> */}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {/* {!dietPlan && error && (
        <p className="text-gray-500 animate-pulse">Loading diet plan...</p>
      )} */}

            {dietPlan && (
                <div className="mb-4 bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">Goal</h4>
                    <p className="text-gray-600">{dietPlan.goal || "Not specified"}</p>
                </div>
            )}

            {dietPlan && (
                <div className="mb-4 bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">Calories</h4>
                    <p className="text-gray-600">{dietPlan.calories || "Not specified"}</p>
                </div>
            )}

            {dietPlan && (
                <div className="mb-4 bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">Protein</h4>
                    <p className="text-gray-600">{dietPlan.protein || "Not specified"}</p>
                </div>
            )}
            {dietPlan && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(dietPlan.parsedPlan).map(([day, meals]) => (
                        <Card key={day} className="bg-white rounded-xl shadow p-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{day}</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                                {Object.entries(meals).map(([mealTime, meal], index) => (
                                    <p key={index}>
                                        <span className="font-semibold">{mealTime}: </span>
                                        {meal}
                                    </p>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {dietPlan && (
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">Water IN TAke</h4>
                    <p className="text-gray-600">{dietPlan.waterInTake || "Not specified"}</p>
                </div>
            )}
            {dietPlan?.note && (
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">Trainer Notes</h4>
                    <p className="text-gray-600 mt-2 whitespace-pre-line">
                        {dietPlan.note}
                    </p>
                </div>
            )}
        </div>
    );
}

export default DietPage;
