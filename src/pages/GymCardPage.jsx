import React, { useState, useEffect } from 'react'
import adminService from '../appwrite/Admin'
import GymCard from '../components/GymCard'
import { useNavigate, useParams } from 'react-router-dom'

function GymCardPage() {
    const[gyms , setGyms] = useState([])
    const navigate = useNavigate()
    

    useEffect(() => {
        const fetchGyms = async () => {
            try {
                const response = await adminService.listGyms()
                if(response?.documents && response.documents.length > 0){
                    setGyms(response.documents)
                }
            } catch (error) {
                console.error("Error fetching gyms: ", error)
            }
        }
        fetchGyms()
    },[])

    const handleJoin = (gymId) => {
        console.log("Joining gym with ID: ", gymId)
        navigate(`/gyms/${gymId}`) // 👈 Redirect to gym detail page
      }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Gyms</h1>

      {/* Render gym cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gyms.length === 0 ? (
          <p>No gyms available.</p>
        ) : (
          gyms.map((gym) => (
            <GymCard
              key={gym.$id}
              gymName={gym.gymName}
              adminEmail={gym.adminEmail}
              address={gym.gymAddress}
              description={gym.gymDescription}
              onJoin={() => handleJoin(gym.$id)} // Pass handleJoin as onJoin prop
            />
          ))
        )}
      </div>
    </div>
  )
}

export default GymCardPage