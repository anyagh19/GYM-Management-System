import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { memberService } from '../../appwrite/Member';
import { Link } from 'react-router-dom';
import trainerService from '../../appwrite/Trainer';
import { motion, AnimatePresence } from 'framer-motion';

function UserDash() {
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [showTrainerRatingForm, setShowTrainerRatingForm] = useState(false);
  const [showGymRatingForm, setShowGymRatingForm] = useState(false);
  const [gymRating, setGymRating] = useState(5);
  const [gymFeedback, setGymFeedback] = useState('');
  const [gymMessage, setGymMessage] = useState('');

  const [bmiAge, setBmiAge] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!userData) return;

      try {
        const memberDoc = await memberService.getMemberPlan(userData.$id);
        if (memberDoc) {
          const { planID, registrationDate, expiryDate, title } = memberDoc;
          setPlanInfo({ planID, registrationDate, expiryDate, title });
        } else {
          setPlanInfo(null);
        }
      } catch (err) {
        console.error('Error fetching plan info:', err);
        setPlanInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [userData]);

  const handleTrainerRatingSubmit = async () => {
    if (!rating) return setMessage("Trainer feedback is required!");

    try {
      const trainerInfo = await trainerService.getTrainerIdFromUserID(userData.$id);
      if (!trainerInfo?.trainerID) return setMessage("Trainer not found!");

      await memberService.getTrainerRating({ trainerID: trainerInfo.trainerID, userID: userData.$id });
      await memberService.rateTrainer({
        trainerID: trainerInfo.trainerID,
        userID: userData.$id,
        feedback,
        name: userData.name
      });

      setMessage("✅ Submitted successfully!");
      setRating(5);
      setFeedback('');
    } catch (error) {
      setMessage("❌ Failed to submit rating.");
    }
  };

  const handleGymRatingSubmit = async () => {
    if (!gymRating) return setGymMessage("Gym rating is required!");

    try {
      const gym = await memberService.getGymIDFromUserID(userData.$id);
      if (!gym?.gymID) return setGymMessage("Gym not found!");

      await memberService.getGymRating({ gymID: gym.gymID, userID: userData.$id });
      await memberService.rateGym({
        gymID: gym.gymID,
        userID: userData.$id,
        feedback: gymFeedback,
        name: userData.name
      });

      setGymMessage("✅ Submitted successfully!");
      setGymRating(5);
      setGymFeedback('');
    } catch (error) {
      setGymMessage("❌ Failed to submit.");
    }
  };

  const toggleTrainerRatingSection = () => setShowTrainerRatingForm(!showTrainerRatingForm);
  const toggleGymRatingSection = () => setShowGymRatingForm(!showGymRatingForm);

  const handleBMICheck = () => {
    if (!bmiAge || !bmiWeight || !bmiHeight) {
      return setBmiResult({ bmi: '-', status: '❗ Please fill all fields.', ideal: null });
    }

    const heightInMeters = bmiHeight / 100;
    const bmi = (bmiWeight / (heightInMeters * heightInMeters)).toFixed(2);

    let status = '';
    if (bmi < 18.5) status = 'You are underweight.';
    else if (bmi < 25) status = 'You are in the normal weight range.';
    else if (bmi < 30) status = 'You are overweight.';
    else status = 'You are obese.';

    const minIdeal = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxIdeal = (24.9 * heightInMeters * heightInMeters).toFixed(1);

    setBmiResult({ bmi, status, ideal: `${minIdeal}kg - ${maxIdeal}kg` });
  };


  if (loading) return <div className="text-center py-10 text-gray-500">Loading your dashboard...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      <motion.h2
        className="text-4xl font-bold text-center mb-10 text-indigo-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Dashboard
      </motion.h2>

      {/* Plan Info */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-3">My Plan</h3>
        {planInfo?.planID ? (
          <div className="bg-green-100 text-green-900 p-5 rounded-xl inline-block shadow-md">
            <p><strong>Plan ID:</strong> {planInfo.planID}</p>
            <p><strong>Title:</strong> {planInfo.title}</p>
            <p><strong>Start:</strong> {new Date(planInfo.registrationDate).toLocaleDateString()}</p>
            <p><strong>Expires:</strong> {new Date(planInfo.expiryDate).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-red-500 font-medium">No active plan found.</p>
        )}
      </motion.div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 px-4 sm:px-0">
        {[{ title: "Workout", path: "/workout", desc: "Your personalized workout plan" },
        { title: "Diet", path: "/diet", desc: "Your custom diet schedule" }].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Link to={item.path}>
              <div className="bg-white border rounded-xl p-6 text-center shadow hover:shadow-lg transition">
                <h4 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h4>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Rating Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-5 text-center mb-10">
        <button
          onClick={toggleTrainerRatingSection}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {showTrainerRatingForm ? "Hide " : "Feedback Trainer"}
        </button>
        <button
          onClick={toggleGymRatingSection}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {showGymRatingForm ? "Hide" : "Feedback Gym"}
        </button>
      </div>

      {/* Trainer Rating Form */}
      <AnimatePresence>
        {showTrainerRatingForm && (
          <motion.div
            className="bg-white border p-6 rounded-lg shadow max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-center mb-4">Trainer Rating</h3>
            {message && <p className="text-center text-blue-600 mb-4">{message}</p>}
            <textarea
              placeholder="Feedback (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border p-2 mb-4 rounded-md"
            />
            <button
              onClick={handleTrainerRatingSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gym Rating Form */}
      <AnimatePresence>
        {showGymRatingForm && (
          <motion.div
            className="bg-white border p-6 rounded-lg shadow max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-center mb-4">Gym Rating</h3>
            {gymMessage && <p className="text-center text-blue-600 mb-4">{gymMessage}</p>}
            <textarea
              placeholder="Feedback (optional)"
              value={gymFeedback}
              onChange={(e) => setGymFeedback(e.target.value)}
              className="w-full border p-2 mb-4 rounded-md"
            />
            <button
              onClick={handleGymRatingSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BMI Checker */}
      <motion.div
        className="bg-white border p-6 rounded-lg shadow max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-semibold text-center mb-4">BMI Checker</h3>
        <div className="grid gap-4 mb-4 md:grid-cols-3">
          <input
            type="number"
            placeholder="Age (yrs)"
            className="border p-2 rounded-md w-full"
            value={bmiAge}
            onChange={(e) => setBmiAge(e.target.value)}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            className="border p-2 rounded-md w-full"
            value={bmiWeight}
            onChange={(e) => setBmiWeight(e.target.value)}
          />
          <input
            type="number"
            placeholder="Height (cm)"
            className="border p-2 rounded-md w-full"
            value={bmiHeight}
            onChange={(e) => setBmiHeight(e.target.value)}
          />
        </div>
        <button
          onClick={handleBMICheck}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Check BMI
        </button>
        {bmiResult && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-800">Your BMI: {bmiResult.bmi}</p>
            <p className="text-sm text-gray-600">{bmiResult.status}</p>
            {bmiResult.ideal && (
              <p className="text-sm text-green-600 font-medium">
                Ideal Weight Range: {bmiResult.ideal}
              </p>
            )}
            <p className="text-xs text-gray-500 italic">Healthy BMI: 18.5 - 24.9</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UserDash;
