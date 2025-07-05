import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import IconCard from '../home/IconCard.jsx'

const Ideas = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ideas')
        const data = await response.json()
        if (data.success) {
          // Format the idea data to match IconCard props
          const formattedIdeas = data.ideas.map(idea => {
            const tech = idea.technology || idea.techStack
            return {
              id: idea._id,
              icon: idea.icon || '💡',
              name: idea.title,
              techStack: Array.isArray(tech) ? tech.join(', ') : tech,
              category: idea.category
            }
          })
          setIdeas(formattedIdeas)
        } else {
          console.error('Failed to fetch ideas')
        }
      } catch (error) {
        console.error('Error fetching ideas:', error)
      }
      setLoading(false)
    }

    fetchIdeas()
  }, [])

  return (
    <div className='p-6 mx-10 md:mx-[10%]'>
      {user?.unsafeMetadata?.role === 'admin' && (
        <h1
          className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-blue-700 to-purple-800 mb-10 text-center cursor-pointer transition-all hover:scale-105 hover:from-gray-700 hover:via-blue-600 hover:to-purple-700'
          onClick={() => navigate('/admin')}
        >
          🚀 Admin Dashboard
        </h1>
      )}

      {/* Title & Button Section */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>💡 Submitted Ideas</h2>
        {user?.unsafeMetadata?.role === 'student' && (
          <Button
            className='bg-yellow-200 border border-yellow-600'
            onClick={() => navigate('/create-idea')}
          >
            Create Idea
          </Button>
        )}
      </div>
      {loading ? (
        <p className='text-center'>Loading ideas...</p>
      ) : ideas.length === 0 ? (
        <p className='text-center text-gray-500'>No ideas found.</p>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {ideas.map(idea => (
            <div
              key={idea.id}
              onClick={() => navigate(`/ideas/${idea.id}`)}
              className='cursor-pointer'
            >
              <IconCard
                icon={idea.icon}
                name={idea.name}
                techStack={idea.techStack || 'N/A'}
                category={idea.category}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Ideas
