import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconCard from '../IconCard.jsx'
import { useUser } from '@clerk/clerk-react'

const Projects = () => {
  const { user } = useUser();
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/projects')
        const data = await response.json()

        console.log('API Response:', data)

        if (data.success) {
          setProjects(data.projects)
        } else {
          console.error('Error:', data.message)
        }
      } catch (error) {
        console.error('Network Error:', error)
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  return (
    <div className='p-6 max-w-6xl mx-10 md:mx-[10%]'>
      {user?.unsafeMetadata?.role === 'admin' && (
      <h1
      className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-blue-700 to-purple-800 mb-10 text-center cursor-pointer transition-all hover:scale-105 hover:from-gray-700 hover:via-blue-600 hover:to-purple-700'
      onClick={() => navigate('/admin')}
    >
      🚀 Admin Dashboard
    </h1>
    
      )}
      <h2 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
        🚀 Approved Projects
      </h2>

      {loading ? (
        <p className='text-center text-gray-600'>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className='text-center text-gray-600'>No projects approved yet.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {projects.map(project => {
            const formattedProject = {
              id: project._id,
              icon: project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className='w-16 h-16 object-cover rounded-full'
                />
              ) : (
                '📁'
              ),
              name: project.title,
              techStack: Array.isArray(project.techStacks)
                ? project.techStacks.join(', ')
                : project.techStacks,
              category: project.category || 'N/A'
            }

            return (
              <div
                key={formattedProject.id}
                onClick={() => {
                  console.log('Project data:', project)
                  navigate(`/projects/${formattedProject.id}`)
                }}
                className='cursor-pointer'
              >
                <IconCard
                  icon={formattedProject.icon}
                  name={formattedProject.name}
                  techStack={formattedProject.techStack}
                  category={formattedProject.category}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Projects
