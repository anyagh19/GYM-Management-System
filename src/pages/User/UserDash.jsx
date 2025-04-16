import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { memberService } from '../../appwrite/Member';
import { Link } from 'react-router-dom';
import trainerService from '../../appwrite/Trainer';

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

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!userData) return;

      try {
        const memberDoc = await memberService.getMemberPlan(userData.$id);
        if (!memberDoc) {
          setPlanInfo(null);
        } else {
          const { planID, registrationDate, expiryDate, title } = memberDoc;
          setPlanInfo({ planID, registrationDate, expiryDate, title });
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
    if (!rating) {
      setMessage("Trainer ID and rating are required!");
      return;
    }

    try {
      const trainerInfo = await trainerService.getTrainerIdFromUserID(userData.$id);

      console.log("Trainer Info:", trainerInfo);
      if (!trainerInfo || !trainerInfo.trainerID) {
        setMessage("Trainer not found!");
        return;
      }

      await memberService.getTrainerRating({
        trainerID: trainerInfo.trainerID,
        userID: userData.$id,
      }).then((res) => {
        if (res) {
          console.log("Trainer rating deleted:", res);
        } else {
          console.log("No previous rating found.");
        }
      })
      await memberService.rateTrainer({
        trainerID: trainerInfo.trainerID,
        userID: userData.$id,
        rating: rating.toString(),
        feedback,
      });
      setMessage("✅ Rating submitted successfully!");
      setRating(5);
      setFeedback('');

    } catch (error) {
      setMessage("❌ Failed to submit rating.");
    }
  };

  const handleGymRatingSubmit = async () => {
    if (!gymRating) {
      setGymMessage("Rating is required!");
      return;
    }

    try {
      const gym = await memberService.getGymIDFromUserID(userData.$id);
      if (!gym || !gym.gymID) {
        setGymMessage("Gym not found!");
        return;
      }

      await memberService.getGymRating({
        gymID: gym.gymID,
        userID: userData.$id,
      })
      await memberService.rateGym({
        gymID: gym.gymID,
        userID: userData.$id,
        rating: parseInt(gymRating),
        feedback: gymFeedback,
      });

      setGymMessage("✅ Gym rating submitted successfully!");
      setGymRating(5);
      setGymFeedback('');
    } catch (error) {
      console.error("Gym rating error:", error);
      setGymMessage("❌ Failed to submit gym rating.");
    }
  };

  const toggleTrainerRatingSection = () => setShowTrainerRatingForm(!showTrainerRatingForm);
  const toggleGymRatingSection = () => setShowGymRatingForm(!showGymRatingForm);

  if (loading) {
    return <div className="text-center py-10">Loading your dashboard...</div>;
  }

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-semibold text-center mb-10">My Progress</h2>

      {/* Plan Info */}
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold mb-2">My Plan</h2>
        {planInfo && planInfo.planID ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-md inline-block">
            <p><strong>Plan ID:</strong> {planInfo.planID}</p>
            <p><strong>Plan title:</strong> {planInfo.title}</p>
            <p><strong>Start:</strong> {new Date(planInfo.registrationDate).toLocaleDateString()}</p>
            <p><strong>Expires:</strong> {new Date(planInfo.expiryDate).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-red-500">No active plan found.</p>
        )}
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        <Link to='/workout'>
          <div className="border rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Workout</h3>
            <p className="text-gray-600">Plan</p>
          </div>
        </Link>

        <Link to='/diet'>
          <div className="border rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-2">Diet</h3>
            <p className="text-gray-600">Plan</p>
          </div>
        </Link>

        <div className="border rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">BMI</h3>
          <p className="text-gray-600">Checking</p>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="text-center flex gap-5">
        <button
          onClick={toggleTrainerRatingSection}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {showTrainerRatingForm ? "Hide Rating Section" : "Rate Trainer"}
        </button>
        <button
          onClick={toggleGymRatingSection}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          {showGymRatingForm ? "Hide Gym Rating" : "Rate Gym"}
        </button>

      </div>

      {/* Collapsible Rating Form */}
      {showTrainerRatingForm && (
        <div className="mt-8 max-w-2xl mx-auto border p-6 rounded-lg shadow bg-white">
          <h3 className="text-2xl font-semibold mb-4 text-center">Trainer Rating</h3>
          {message && <p className="text-center mb-4 text-blue-600">{message}</p>}

          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full border p-2 mb-4 rounded-md"
          />
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
            Submit Rating
          </button>
        </div>
      )}
      {showGymRatingForm && (
        <div className="mt-8 max-w-2xl mx-auto border p-6 rounded-lg shadow bg-white">
          <h3 className="text-2xl font-semibold mb-4 text-center">Gym Rating</h3>
          {gymMessage && <p className="text-center mb-4 text-blue-600">{gymMessage}</p>}

          <input
            type="number"
            min="1"
            max="5"
            value={gymRating}
            onChange={(e) => setGymRating(parseInt(e.target.value))}
            className="w-full border p-2 mb-4 rounded-md"
          />
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
            Submit Gym Rating
          </button>
        </div>
      )}

    </div>
  );
}

export default UserDash;
