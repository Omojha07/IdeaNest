import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import IconCard from './IconCard.jsx'
import EventsCard from './EventsCard.jsx'
import { Lightbulb, GalleryVerticalEnd, Dock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HeroSection from './HeroSection.jsx'

const SeeAllCard = ({ route }) => (
  <Link to={route} className='flex items-center justify-center'>
    <div className='w-[220px] my-4 p-6 border rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg bg-gray-300 shadow-md cursor-pointer'>
      <div className='flex items-center justify-center w-16 h-16 mx-auto my-20 mb-4 rounded-full bg-gray-100'>
        <ArrowRight size={24} />
      </div>
      <h3 className='text-xl font-semibold mb-1 text-gray-800 text-center'>
        View More
      </h3>
      {/* Adding empty placeholders to mimic the IconCard height */}
      <p className='text-sm text-gray-500 text-center mb-3'>&nbsp;</p>
      <div className='flex flex-wrap justify-center gap-2'></div>
    </div>
  </Link>
)

const Section = ({ title, items, CardComponent, seeAllLink }) => {
  const navigate = useNavigate()
  const displayedItems = items.slice(0, 5)

  return (
    <section className='w-full py-12'>
      <div className='mx-auto px-4'>
        {/* Flex container for heading and View All button */}
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800'>{title}</h2>
          <Link
            to={seeAllLink}
            className='text-blue-600 hover:text-blue-800 font-medium transition-all flex hover:bg-yellow-200 rounded-full px-3 py-2 gap-2 justify-center'
          >
            View All <ArrowRight />
          </Link>
        </div>
        <div className='overflow-x-auto'>
          <div className='flex flex-nowrap gap-6'>
            {displayedItems.map(item => (
              // Using display: contents ensures that the wrapping element doesn't affect the card layout/height.
              <div
                key={item.id}
                onClick={() => navigate(`${seeAllLink}/${item.id}`)}
                className='cursor-pointer'
                style={{ display: 'contents' }}
              >
                <CardComponent {...item} />
              </div>
            ))}
            <SeeAllCard route={seeAllLink} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home () {
  const [projects, setProjects] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingIdeas, setLoadingIdeas] = useState(true)

  // Dummy data for events (you can also switch to real data if needed)
  const events = [
    {
      id: 1,
      heading: 'Angular Event',
      backgroundImage: '/illustrations/event1.jpg',
      date: 'October 15, 2025'
    },
    {
      id: 2,
      heading: 'Hackathon',
      backgroundImage: '/illustrations/event2.webp',
      date: 'November 5, 2025'
    },
    {
      id: 3,
      heading: 'AI workshop',
      backgroundImage: '/illustrations/event3.png',
      date: 'December 1, 2025'
    },
    {
      id: 4,
      heading: 'Product Launch',
      backgroundImage: '/illustrations/event4.png',
      date: 'December 1, 2025'
    }
  ]

  useEffect(() => {
    // Fetch Projects data
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/projects')
        const data = await response.json()
        if (data.success) {
          // Format each project with only the required fields and ensure techStack is a string
          const formattedProjects = data.projects.map(project => ({
            id: project._id,
            icon: project.icon || '📁',
            name: project.title,
            techStack: Array.isArray(project.techStacks)
              ? project.techStacks.join(', ')
              : project.techStacks,
            category: project.category
          }))
          setProjects(formattedProjects)
        } else {
          console.error('Failed to fetch projects')
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
      setLoadingProjects(false)
    }

    // Fetch Ideas data
    const fetchIdeas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ideas')
        const data = await response.json()
        if (data.success) {
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
      setLoadingIdeas(false)
    }

    fetchProjects()
    fetchIdeas()
  }, [])

  return (
    <div className='min-h-screen'>
      <div className='flex justify-between items-center p-4 border-b'>
        {/* Start Link */}
        <div className='flex gap-4'>
          <Link to='/ai-mentor'>
            <Button variant='default'>
              <GalleryVerticalEnd />
              AI Business Mentor
            </Button>
          </Link>
        </div>

        {/* End Links */}
        <div className='flex gap-4'>
          <Link to='/profile/saved-projects'>
            <Button variant='default'>
              <GalleryVerticalEnd />
              Saved projects
            </Button>
          </Link>
          <Link to='/profile/my-projects'>
            <Button>
              <Dock />
              My Projects
            </Button>
          </Link>
          <Link to='/create-idea'>
            <Button>
              <Lightbulb />
              Share your Idea
            </Button>
          </Link>
        </div>
      </div>
      <div className='mx:10 md:mx-[10%]'>
        <HeroSection />
        {loadingProjects ? (
          <p className='text-center'>Loading projects...</p>
        ) : (
          <Section
            title='Projects'
            items={projects}
            CardComponent={IconCard}
            seeAllLink='/projects'
          />
        )}
        <div className="border-b border-black/20"></div>
        {loadingIdeas ? (
          <p className="text-center">Loading ideas...</p>
        ) : (
          <Section
            title="Ideas"
            items={ideas}
            CardComponent={IconCard}
            seeAllLink="/ideas"
          />
        )}
        <div className='border-b border-black/20'></div>
        <Section
          title='Events'
          items={events}
          CardComponent={EventsCard}
          seeAllLink='/events'
        />
      </div>
    </div>
  )
}
