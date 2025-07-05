import React, { useState, useEffect } from 'react'
import axios from 'axios'

// --- Filter Components (same as before, no search inputs) ---
import CategoryFilter from './CategoryFilter'
import TechnologyFilter from './TechnologyFilter'
import TopicFilter from './TopicFilter'

const SearchPage = () => {
  // -----------------------------
  //      State for Users
  // -----------------------------
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [sort, setSort] = useState('')
  const [category, setCategory] = useState('') // for user fetch if needed

  // -----------------------------
  //      State for Projects
  // -----------------------------
  const [allProjects, setAllProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])

  // -----------------------------
  //   Filter States
  // -----------------------------
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTechnologies, setSelectedTechnologies] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])

  // -----------------------------
  //  Mobile Drawer Toggle
  // -----------------------------
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // -----------------------------
  //  Fetch Projects on Mount
  // -----------------------------
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projects')
        if (response.data && Array.isArray(response.data.projects)) {
          setAllProjects(response.data.projects)
          setFilteredProjects(response.data.projects) // show all initially
        } else {
          setAllProjects([])
          setFilteredProjects([])
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setAllProjects([])
        setFilteredProjects([])
      }
    }
    fetchProjects()
  }, [])

  // -----------------------------
  //   Fetch Users on Filters
  // -----------------------------
  useEffect(() => {
    fetchUsers()
  }, [search, role, sort, category])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        params: { search, role, sort, category }
      })
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // -----------------------------
  //   Reusable Filter Layout
  // -----------------------------
  const renderFilters = () => (
    <>
      <h2 className='text-2xl font-bold mb-6 border-b border-yellow-400 pb-2'>
        Filter Projects
      </h2>
      <div className='space-y-6'>
        <CategoryFilter
          selected={selectedCategories}
          setSelected={setSelectedCategories}
        />
        <TechnologyFilter
          selected={selectedTechnologies}
          setSelected={setSelectedTechnologies}
        />
        <TopicFilter
          selected={selectedTopics}
          setSelected={setSelectedTopics}
        />
      </div>
    </>
  )

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* MOBILE: 'Show Filters' button appears only on small screens */}
      <div className='block md:hidden p-4'>
        <button
          onClick={() => setMobileFilterOpen(true)}
          className='px-4 py-2 bg-yellow-600 text-white rounded shadow'
        >
          Show Filters
        </button>
      </div>

      {/* SIDEBAR (visible on desktop, hidden on mobile) */}
      <aside className='hidden md:block w-1/4 bg-yellow-100 text-gray-800 p-6 border-r border-yellow-300 shadow-lg'>
        {renderFilters()}
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileFilterOpen && (
        <div className='fixed inset-0 z-50 flex'>
          {/* Semi-transparent backdrop */}
          <div
            className='absolute inset-0 bg-black bg-opacity-50'
            onClick={() => setMobileFilterOpen(false)}
          ></div>
          {/* Drawer Panel */}
          <div className='relative w-3/4 bg-yellow-100 text-gray-800 p-6 shadow-lg overflow-auto'>
            {/* Close Button */}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className='absolute top-2 right-2 text-2xl font-bold text-black'
            >
              &times;
            </button>
            {renderFilters()}
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className='flex-1 p-4 md:p-8'>
        <h2 className='text-3xl font-bold text-yellow-600 mb-6 text-center'>
          Search & Filter
        </h2>

        {/* Search & Role Filters */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6'>
          {/* Search Input */}
          <input
            type='text'
            placeholder='Search by name or email...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='w-full md:w-64 p-3 rounded-lg border border-yellow-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
          />

          {/* Role Dropdown */}
          <select
            onChange={e => setRole(e.target.value)}
            className='w-full md:w-40 p-3 rounded-lg border border-yellow-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
          >
            <option value=''>All</option>
            <option value='mentor'>Mentors</option>
            <option value='user'>Students</option>
          </select>

          {/* Sort Dropdown */}
          <select
            onChange={e => setSort(e.target.value)}
            className='w-full md:w-40 p-3 rounded-lg border border-yellow-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500'
          >
            <option value=''>Default</option>
            <option value='name'>Sort by Name</option>
            <option value='newest'>Sort by Newest</option>
          </select>
        </div>

        {/* Display Users (if any search, role, or sort is active) */}
        {(search || role || sort) && (
          <div>
            <h3 className='text-2xl font-semibold text-yellow-600 mb-4'>
              Users
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {users.length > 0 ? (
                users.map(user => (
                  <div
                    key={user._id || user.email}
                    className='p-6 bg-white border border-yellow-400 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200'
                  >
                    {/* User Info */}
                    <div className='flex items-center gap-2'>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className='w-12 h-12 rounded-full border-2 border-yellow-400 shadow-sm'
                      />
                      <div className='flex flex-col'>
                        <div className='flex items-center gap-2'>
                          <h3 className='text-xl font-semibold text-yellow-600'>
                            {user.name}
                          </h3>
                          <span
                            className={`
    px-3 py-1 text-xs font-semibold rounded-full shadow-md text-white
    ${
      user.role === 'admin'
        ? 'bg-red-500'
        : user.role === 'student'
        ? 'bg-blue-500'
        : user.role === 'mentor'
        ? 'bg-green-500'
        : 'bg-gray-500'
    }
  `}
                          >
                            {user.role}
                          </span>
                        </div>
                        <p className='text-gray-600'>{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-center text-gray-500 col-span-full'>
                  No users found.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Display All Projects */}
        <div className='mt-8'>
          <h3 className='text-2xl font-semibold text-yellow-600 mb-4'>
            All Projects
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div
                  key={project._id}
                  className='bg-white shadow-lg rounded-lg p-5 border border-yellow-400 hover:shadow-2xl transition duration-300'
                >
                  {/* Optional Project Image */}
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className='w-full h-40 object-cover rounded-lg'
                    />
                  )}

                  {/* Project Title */}
                  <h3 className='text-xl font-semibold text-yellow-600 mt-3'>
                    {project.title}
                  </h3>
                  <p className='text-gray-700 mt-2'>{project.description}</p>

                  {/* Additional Info */}
                  <div className='mt-3 space-y-1 text-gray-600'>
                    <p className='text-sm font-semibold'>
                      📌 Category:{' '}
                      <span className='font-normal'>
                        {project.category || 'N/A'}
                      </span>
                    </p>
                    <p className='text-sm font-semibold'>
                      Tech stack:{' '}
                      <span className='font-normal'>
                        {project.techStacks || 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-gray-500 col-span-full'>No projects found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
