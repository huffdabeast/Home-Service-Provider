import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [services, setServices] = useState([])

  useEffect(() => {
    getServices()
  }, [])

  async function getServices() {
    const { data } = await supabase.from('services').select()
    setServices(data)
  }

  return (
    <div>
      <h1>Home Service Provider</h1>
      <h2>Available Services</h2>
      {services.length === 0 ? (
        <p>No services found. Have you created the 'services' table in Supabase?</p>
      ) : (
        <ul>
          {services.map((service) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
