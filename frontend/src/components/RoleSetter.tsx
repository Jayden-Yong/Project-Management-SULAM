import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'

export function RoleSetter({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const setRole = async () => {
      if (isLoaded && user) {
        const existingRole = user.unsafeMetadata?.role
        const pendingRole = sessionStorage.getItem('pendingUserRole')

        if (!existingRole && pendingRole) {
          try {
            await user.update({
              unsafeMetadata: {
                ...user.unsafeMetadata,
                role: pendingRole
              }
            })
            sessionStorage.removeItem('pendingUserRole')
            console.log(`User role set to: ${pendingRole}`)
          } catch (error) {
            console.error('Error setting role:', error)
          }
        }
      }
    }

    setRole()
  }, [isLoaded, user])

  return <>{children}</>
}
