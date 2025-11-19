"use client"

import { useSignIn } from '@clerk/clerk-react'

import {
  Button,
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Input, Label,
  Tabs, TabsContent, TabsList, TabsTrigger
} from "../../components/ui"

import { Heart, Mail, Lock, User } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Organizer state
  const [organizerEmail, setOrganizerEmail] = useState("")
  const [organizerPassword, setOrganizerPassword] = useState("")

  // Volunteer state
  const [volunteerEmail, setVolunteerEmail] = useState("")
  const [volunteerPassword, setVolunteerPassword] = useState("")

  // user role control
  const [currentTab, setCurrentTab] = useState<"volunteer" | "organizer">("volunteer")

  const handleGoogleSignIn = () => {
    sessionStorage.setItem('pendingUserRole', currentTab)

    signIn?.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard"
    })
  }

  const handleAppleSignIn = () => {
    sessionStorage.setItem('pendingUserRole', currentTab)

    signIn?.authenticateWithRedirect({
      strategy: "oauth_apple",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard"
    })
  }

  const handleVolunteerLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    setLoading(true)
    setError("")

    try {
      const result = await signIn.create({
        identifier: volunteerEmail,
        password: volunteerPassword,
      })

      if (result.status === "complete") {
        // Store role for role setter component
        sessionStorage.setItem('pendingUserRole', 'volunteer')
        
        // Set the active session
        await setActive({ session: result.createdSessionId })

        navigate("/dashboard")
      } else {
        // Handle other statuses (e.g., needs 2FA)
        console.log("Sign in not complete:", result)
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid email or password")
      console.error("Sign in error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOrganizerLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    setLoading(true)
    setError("")

    try {
      const result = await signIn.create({
        identifier: organizerEmail,
        password: organizerPassword,
      })

      if (result.status === "complete") {
        // Store role for role setter component
        sessionStorage.setItem('pendingUserRole', 'organizer')
        
        await setActive({ session: result.createdSessionId })
        navigate("/dashboard")
      } else {
        console.log("Sign in not complete:", result)
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid email or password")
      console.error("Sign in error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">VolunteerHub</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Welcome back! Sign in to your account</p>
        </div>

        {/* Login Card */}
        <Card className="border-2 rounded-3xl shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Choose your account type to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="volunteer" className="space-y-4" onValueChange={(value) => setCurrentTab(value as "volunteer" | "organizer")}>
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="volunteer" className="rounded-full">
                  As Volunteer
                </TabsTrigger>
                <TabsTrigger value="organizer" className="rounded-full">
                  As Organizer
                </TabsTrigger>
              </TabsList>

              {/* Volunteer Login */}
              <TabsContent value="volunteer">
                <form onSubmit={handleVolunteerLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="volunteer-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="volunteer-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={volunteerEmail}
                        onChange={(e) => setVolunteerEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="volunteer-password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="volunteer-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={volunteerPassword}
                        onChange={(e) => setVolunteerPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In as Volunteer"}
                  </Button>

                  {/* Error message */}
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* OAuth Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      className="rounded-full"
                      disabled={loading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppleSignIn}
                      className="rounded-full"
                      disabled={loading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      Apple
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Organizer Login */}
              <TabsContent value="organizer">
                <form onSubmit={handleOrganizerLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizer-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="organizer-email"
                        type="email"
                        placeholder="organization@example.com"
                        className="pl-10"
                        value={organizerEmail}
                        onChange={(e) => setOrganizerEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="organizer-password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="organizer-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={organizerPassword}
                        onChange={(e) => setOrganizerPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In as Organizer"}
                  </Button>

                  {/* Error message */}
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* OAuth Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                      className="rounded-full"
                      disabled={loading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppleSignIn}
                      className="rounded-full"
                      disabled={loading}
                    >
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      Apple
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
