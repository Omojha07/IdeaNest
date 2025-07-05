import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi' // Import arrow icon
import axios from 'axios'

export default function AdminDashboard () {
  const [ideas, setIdeas] = useState([]);
  const { user, isLoaded } = useUser()
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [adminData, setAdminData] = useState({ ideas: [], users: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && user) {
      const fetchAdminData = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/admin', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'user-id': user.id // Send Clerk user ID to backend
            }
          })

          if (response.status === 403) {
            navigate('/unauthorized')
            return
          }

          const data = await response.json()
          setAdminData(data)
        } catch (error) {
          console.error('Error fetching admin data:', error)
          setError('Failed to load admin data.')
        } finally {
          setLoading(false)
        }
      }

      fetchAdminData()
    }
  }, [user, isLoaded, navigate])


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data concurrently
        const [usersRes, ideasRes, projectsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/users'),
          axios.get('http://localhost:3000/api/ideas'),
          axios.get('http://localhost:3000/api/projects'),
        ]);

        // Handle different API response structures
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || []);
        setIdeas(Array.isArray(ideasRes.data) ? ideasRes.data : ideasRes.data.ideas || []);
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data.projects || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const createEvent = async e => {
    e.preventDefault()
    await axios.post('/api/admin/create-event', event)
    alert('Event Created!')
    setEvent({ name: '', date: '', description: '' })
  }

  if (loading) return <p>Loading admin data...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className='p-8 max-w-7xl mx-auto'>
      {/* Header */}
      <h1
        className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-blue-700 to-purple-800 mb-10 text-center cursor-pointer transition-all hover:scale-105 hover:from-gray-700 hover:via-blue-600 hover:to-purple-700'
        onClick={() => navigate('/admin')}
      >
        🚀 Admin Dashboard
      </h1>

      {/* Dashboard Summary - Users, Ideas, Projects */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div
          className='bg-gradient-to-br from-blue-400 to-blue-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-102 cursor-pointer'
          onClick={() => navigate('/admin/users')}
        >
          <div className='flex justify-between items-center'>
            <h2 className='text-3xl font-semibold'>👥 Users</h2>
            <FiArrowRight className='text-4xl opacity-80 transition-transform duration-300 group-hover:translate-x-2' />
          </div>
          <p className='text-5xl font-bold mt-4'>{loading ? 'Loading...' : users.length}</p>
        </div>

        <div
          className='bg-gradient-to-br from-green-400 to-green-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-102 cursor-pointer'
          onClick={() => navigate('/ideas')}
        >
          <div className='flex justify-between items-center'>
            <h2 className='text-3xl font-semibold'>💡 User Ideas</h2>
            <FiArrowRight className='text-4xl opacity-80 transition-transform duration-300 group-hover:translate-x-2' />
          </div>
          <p className='text-5xl font-bold mt-4'>{loading ? 'Loading...' : ideas.length}</p>
        </div>

        <div
          className='bg-gradient-to-br from-purple-400 to-purple-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-102 cursor-pointer'
          onClick={() => navigate('/admin/projects')}
        >
          <div className='flex justify-between items-center'>
            <h2 className='text-3xl font-semibold'>🚀 Projects</h2>
            <FiArrowRight className='text-4xl opacity-80 transition-transform duration-300 group-hover:translate-x-2' />
          </div>
          <p className='text-5xl font-bold mt-4'>{loading ? 'Loading...' : projects.length}</p>
        </div>
      </div>

      {/* Users Section */}
      <div
        className='mt-12 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-102'
        onClick={() => navigate('/admin/users')}
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>👤 Users</h2>
          <FiArrowRight className='text-3xl text-gray-500 transition-transform duration-300 group-hover:translate-x-2' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Add user cards here */}
        </div>
      </div>

      {/* Ideas Section */}
      <div
        className='mt-12 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-102'
        onClick={() => navigate('/ideas')}
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-3xl font-bold text-black mb-4'>💡 Ideas</h2>
          <FiArrowRight className='text-3xl text-gray-500 opacity-80 transition-transform duration-300 group-hover:translate-x-2' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Add idea cards */}
        </div>
      </div>

      {/* Projects Section */}
      <div
        className='mt-12 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-102'
        onClick={() => navigate('/admin/projects')}
      >
        <div className='flex justify-between items-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>🚀 Projects</h2>
          <FiArrowRight className='text-3xl text-gray-500 transition-transform duration-300 group-hover:translate-x-2' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Add project cards */}
        </div>
      </div>

      {/* Create Event Section */}
      <div className='mt-12 bg-gradient-to-r from-pink-500 to-purple-600 p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-102'>
        <h2 className='text-4xl font-bold text-white mb-6'>🎯 Create Event</h2>
        <form onSubmit={createEvent} className='space-y-6'>
          <input
            type='text'
            placeholder='Event Name'
            value={event.name}
            // onChange={(e) => setEvent({ ...event, name: e.target.value })}
            required
            className='w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
          />

          <input
            type='date'
            value={event.date}
            // onChange={(e) => setEvent({ ...event, date: e.target.value })}
            required
            className='w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
          />

          <textarea
            placeholder='Event Description'
            value={event.description}
            // onChange={(e) =>
            //   setEvent({ ...event, description: e.target.value })
            // }
            required
            className='w-full p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
          />

          <button
            type='submit'
            className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg hover:shadow-lg transition-all transform hover:scale-102'
          >
            🚀 Create Event
          </button>
        </form>
      </div>
    </div>
  )
}
