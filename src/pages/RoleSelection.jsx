import { useUser } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

function RoleSelection () {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  const handleRoleSelection = async role => {
    try {
      await user.update({ unsafeMetadata: { role } })

      await new Promise(resolve => setTimeout(resolve, 2000))

      await user.reload()

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress,
          role: user.unsafeMetadata.role,
          avatar: user.imageUrl
        })
      })

      const data = await res.json()

      navigate('/home')
    } catch (err) {
      console.error('❌ Error updating role:', err)
    }
  }

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate('/home')
    }
  }, [user, navigate])

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />
  }

  return (
    <div className='flex flex-col items-center justify-center mt-40'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>
        I am a...
      </h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button
          variant='blue'
          className='h-36 text-2xl'
          onClick={() => handleRoleSelection('student')}
        >
          Student
        </Button>
        <Button
          variant='destructive'
          className='h-36 text-2xl'
          onClick={() => handleRoleSelection('mentor')}
        >
          Mentor
        </Button>
      </div>
    </div>
  )
}

export default RoleSelection