import React from 'react'

function About() {
    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About</h1>
    
          <p className="mb-6 text-gray-800">
            Welcome to <strong>Captain Gym</strong>, your ultimate destination for fitness, strength, and transformation. 
            Our mission is to empower individuals to lead healthier lives through innovation, motivation, and expert guidance.
          </p>
    
          <p className="mb-6 text-gray-800">
            Captain Gym is powered by a smart, automated system designed to streamline all aspects of gym operations and enhance 
            your fitness journey. From easy online membership registration and customized workout tracking to real-time class 
            schedules and secure billing, we use technology to bring convenience and performance to the forefront.
          </p>
    
          <div className="mb-6">
            <p className="font-semibold mb-2">Our system enables:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-800">
              <li>Hassle-free online sign-ups and membership renewals</li>
              <li>Personalized health tracking and BMI-based training plans</li>
              <li>Secure billing and payments</li>
              <li>Efficient class and trainer scheduling</li>
            </ul>
          </div>
    
          <p className="mb-6 text-gray-800">
            Driven by a passion for fitness and innovation, Captain Gym is more than just a workout space – it’s a community 
            where your progress is our priority. We continue to evolve by integrating modern technologies like AI-driven personal 
            coaching and health tech integrations for wearables.
          </p>
    
          <p className="text-gray-800">
            Join Captain Gym and take command of your fitness goals with a system built to support, motivate, and inspire you every step of the way.
          </p>
        </div>
  )
}

export default About