"use client"

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Input, Label, Tabs, TabsContent, TabsList, TabsTrigger,
 } from "../../components/ui"

import { Heart, Mail, Lock, User, Building } from 'lucide-react'
import { Link } from "react-router-dom"
import { useState } from "react"

export default function SignupPage() {
  const [volunteerData, setVolunteerData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [organizerData, setOrganizerData] = useState({
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleVolunteerSignup = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Volunteer signup:", volunteerData)
    // In a real app, this would create account with Supabase
  }

  const handleOrganizerSignup = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Organizer signup:", organizerData)
    // In a real app, this would create account with Supabase
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
          <p className="mt-2 text-sm text-muted-foreground">Start your journey of making a difference</p>
        </div>

        {/* Signup Card */}
        <Card className="border-2 rounded-3xl shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center">Choose how you want to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="volunteer" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="volunteer" className="rounded-full">
                  As Volunteer
                </TabsTrigger>
                <TabsTrigger value="organizer" className="rounded-full">
                  As Organizer
                </TabsTrigger>
              </TabsList>

              {/* Volunteer Signup */}
              <TabsContent value="volunteer">
                <form onSubmit={handleVolunteerSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="volunteer-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="volunteer-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10"
                        value={volunteerData.name}
                        onChange={(e) => setVolunteerData({ ...volunteerData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volunteer-signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="volunteer-signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={volunteerData.email}
                        onChange={(e) => setVolunteerData({ ...volunteerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volunteer-signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="volunteer-signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={volunteerData.password}
                        onChange={(e) => setVolunteerData({ ...volunteerData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volunteer-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="volunteer-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={volunteerData.confirmPassword}
                        onChange={(e) => setVolunteerData({ ...volunteerData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-full" size="lg">
                    Sign Up as Volunteer
                  </Button>
                </form>
              </TabsContent>

              {/* Organizer Signup */}
              <TabsContent value="organizer">
                <form onSubmit={handleOrganizerSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization-name">Organization Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="organization-name"
                        type="text"
                        placeholder="Ocean Guardians"
                        className="pl-10"
                        value={organizerData.organizationName}
                        onChange={(e) => setOrganizerData({ ...organizerData, organizationName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizer-signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="organizer-signup-email"
                        type="email"
                        placeholder="organization@example.com"
                        className="pl-10"
                        value={organizerData.email}
                        onChange={(e) => setOrganizerData({ ...organizerData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizer-signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="organizer-signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={organizerData.password}
                        onChange={(e) => setOrganizerData({ ...organizerData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizer-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="organizer-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={organizerData.confirmPassword}
                        onChange={(e) => setOrganizerData({ ...organizerData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full rounded-full" size="lg">
                    Sign Up as Organizer
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
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
