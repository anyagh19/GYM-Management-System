import React, { useEffect, useState } from 'react'
import adminService from '../../appwrite/Admin'

function Feedback() {
  const [feedTrainer, setFeedTrainer] = useState([])
  const [feedGym, setFeedGym] = useState([])

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await adminService.listFeedGym()
        if (res.documents && res.documents.length > 0) {
          setFeedGym(res.documents)
        }

        const res1 = await adminService.listFeedTrainer()
        if (res1.documents && res1.documents.length > 0) {
          setFeedTrainer(res1.documents)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchFeedback()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gym Feedback</h2>
      <ul className="mb-8 space-y-3">
        {feedGym.map((feedback, index) => (
          <li key={index} className="bg-white p-4 rounded shadow text-gray-700">
            <p className="font-medium">{feedback.userID}</p>
            <p className="font-medium">{feedback.name}</p>
            <p className="text-sm">{feedback.feedback}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Trainer Feedback</h2>
      <ul className="space-y-3">
        {feedTrainer.map((feedback, index) => (
          <li key={index} className="bg-white p-4 rounded shadow text-gray-700">
            <p className="font-medium">{feedback.userID}</p>
            <p className="font-medium">{feedback.name}</p>
            <p className="text-sm">{feedback.feedback}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Feedback
