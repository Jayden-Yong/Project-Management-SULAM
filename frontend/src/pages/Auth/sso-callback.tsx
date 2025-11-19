import { AuthenticateWithRedirectCallback, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function SSOCallback() {
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()

  useEffect(() => {
    const setUserRole = async () => {
        if (isLoaded && user) {
            const existingRole = user.unsafeMetadata?.role

            if (!existingRole) {
                const pendingRole = sessionStorage.getItem('pendingUserRole') || "volunteer"

                try {
                    await user.update({
                        unsafeMetadata: {
                            ...user.unsafeMetadata,
                            role: pendingRole
                        }
                    })

                    sessionStorage.removeItem('pendingUserRole')
                } catch (error) {
                    console.error('Error setting user role:', error)
                }
            }

            navigate('/dashboard')
        }
    }

    setUserRole()
}, [isLoaded,user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
      
      <AuthenticateWithRedirectCallback
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </div>
  )
}
