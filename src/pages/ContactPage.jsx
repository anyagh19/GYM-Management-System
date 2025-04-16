import React from 'react'

function ContactPage() {
  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Contact</h1>

      <p className="mb-6 text-gray-800">
        We’d love to hear from you! Whether you have questions about our membership plans, need support, 
        or simply want to know more about Captain Gym, feel free to reach out to us through any of the channels below.
      </p>

      <div className="mb-6 text-gray-800">
        <p><strong>Captain Gym</strong></p>
        <p><strong>Address:</strong> Kedgaon, Near Kedgaon Railway Station, Daund, Pune – 412203</p>
        <p><strong>Phone:</strong> +91 99756 41896</p>
        <p><strong>Email:</strong> captaingym@1828gmail.com</p>
      </div>

      <p className="mb-2 text-gray-800">
        We’re here to support you on your fitness journey.
      </p>

      <p className="text-gray-800">
        <strong>Operating Hours:</strong><br />
        Monday – Saturday: 6:00 AM – 10:00 PM<br />
        Sunday: 7:00 AM – 12:00 PM
      </p>
    </div>
  )
}

export default ContactPage