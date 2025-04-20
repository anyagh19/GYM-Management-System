import React, { useEffect, useState } from "react";
import memberService from "../../appwrite/Member";
import authService from "../../appwrite/Auth";
import { Card } from "../../../Index";
import { motion } from "framer-motion";

function DietPage() {
  const [dietPlan, setDietPlan] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const user = await authService.getCurrentUser();
        const userID = user.$id;
        const res = await memberService.getDietPlan(userID);

        if (res?.food) {
          const parsedPlan = JSON.parse(res.food);
          setDietPlan({ ...res, parsedPlan });
        }
      } catch (err) {
        console.error("Failed to fetch diet plan", err);
        setError("Could not fetch diet plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiet();
  }, []);

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-pink-600">Diet Plan</h2>
      </motion.div>

      {loading && (
        <motion.p
          className="text-center text-gray-500 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading diet plan...
        </motion.p>
      )}

      {error && (
        <motion.p
          className="text-red-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}

      {dietPlan && (
        <>
          <motion.div
            className="mb-4 bg-gray-100 p-4 rounded-lg shadow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="font-semibold text-gray-700">Goal</h4>
            <p className="text-gray-600">{dietPlan.goal || "Not specified"}</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {["calories", "protein", "waterInTake"].map((key, i) => (
              <motion.div
                key={key}
                className="bg-gray-100 p-4 rounded-lg shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4 className="font-semibold text-gray-700 capitalize">
                  {key === "waterInTake" ? "Water Intake" : key}
                </h4>
                <p className="text-gray-600">
                  {dietPlan[key] || "Not specified"}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {Object.entries(dietPlan.parsedPlan).map(([day, meals]) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
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
              </motion.div>
            ))}
          </motion.div>

          {dietPlan.note && (
            <motion.div
              className="mt-6 bg-gray-100 p-4 rounded-lg shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold text-gray-700">Trainer Notes</h4>
              <p className="text-gray-600 mt-2 whitespace-pre-line">
                {dietPlan.note}
              </p>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default DietPage;
