import { useUser } from '@clerk/clerk-react'

export function useUserRole() {
  const { user, isLoaded } = useUser()
  
  const role = user?.unsafeMetadata?.role as 'volunteer' | 'organizer' | undefined
  
  return {
    role,
    isVolunteer: role === 'volunteer',
    isOrganizer: role === 'organizer',
    isLoaded,
    user
  }
}
