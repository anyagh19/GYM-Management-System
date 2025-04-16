import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import adminService from '../appwrite/Admin'

function GymPage() {
  const { gymId } = useParams()
  //console.log("Gym ID from URL params:", gymId)
  const [gym, setGym] = useState(null)
  const [loading, setLoading] = useState(true)
  const role = localStorage.getItem('role') // 'admin', 'trainer', or 'user'
  const navigate = useNavigate()

  useEffect(() => {
    //console.log("Gym ID from URL params:", gymId)
    if (!gymId) {
      console.error("No gym ID found in URL")
      setLoading(false)
      return
    }

    const fetchGym = async () => {
      try {
        const res = await adminService.getGym(gymId)
        setGym(res)
      } catch (err) {
        console.error("Error fetching gym: ", err)
      } finally {
        setLoading(false)
      }
    }

    fetchGym()
  }, [gymId])

  const handleApplyTrainer = () => {
    navigate(`/trainer_application/${gymId}`);
    // Add Appwrite call here later
  }

  const handleJoinGym = () => {
    navigate(`/gym_plans/${gymId}`);
    // Add DB logic to associate user with gym
  }

  if (loading) return <p className="text-center mt-10 text-lg">Loading gym information...</p>
  if (!gym) return <p className="text-center mt-10 text-lg text-red-500">Gym not found.</p>

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{gym.gymName}</h1>
      
      <div className="space-y-2 mb-6">
        <p><strong className="text-gray-700">Admin Email:</strong> {gym.adminEmail}</p>
        <p><strong className="text-gray-700">Address:</strong> {gym.gymAddress}</p>
        <p><strong className="text-gray-700">Description:</strong> {gym.gymDescription}</p>
      </div>

      {role === 'trainer' && (
        <button
          onClick={handleApplyTrainer}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md text-lg font-medium"
        >
          Apply as Trainer
        </button>
      )}

      {role === 'user' && (
        <button
          onClick={handleJoinGym}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-lg font-medium"
        >
          Join Gym
        </button>
      )}
    </div>
  )
}

export default GymPage
