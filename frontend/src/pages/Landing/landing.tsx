import { Button, Card, CardContent } from "../../components/ui"
import { CalendarDays, Users, MessageSquare, Heart, ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"
import { SignedIn, SignedOut } from "@clerk/clerk-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">VolunteerHub</span>
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <Link
                to="#events"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Events
              </Link>
              <Link
                to="#about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                to="#community"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Community
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <SignedIn>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </SignedIn>
              <SignedOut>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="rounded-full" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Built for the community</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Make a Difference, <span className="text-primary">Together</span>
              </h1>
              <p className="text-lg text-pretty text-muted-foreground leading-relaxed">
                Join a vibrant community of volunteers and organizers working to create positive change. Discover
                events, track your impact, and connect with like-minded changemakers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-full" asChild>
                  <Link to="/events">
                    Explore Events <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <SignedIn>
                  <Button size="lg" variant="outline" className="rounded-full bg-transparent" asChild>
                    <Link to="/dashboard">View Dashboard</Link>
                  </Button>
                </SignedIn>

              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-2 hover:border-primary transition-colors rounded-2xl">
                <CardContent className="p-6 space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">2,500+</h3>
                  <p className="text-sm text-muted-foreground">Active Volunteers</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-secondary transition-colors rounded-2xl sm:mt-8">
                <CardContent className="p-6 space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <CalendarDays className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">150+</h3>
                  <p className="text-sm text-muted-foreground">Events This Month</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-accent transition-colors rounded-2xl">
                <CardContent className="p-6 space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                    <Heart className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">10,000+</h3>
                  <p className="text-sm text-muted-foreground">Hours Contributed</p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary transition-colors rounded-2xl sm:mt-8">
                <CardContent className="p-6 space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">4.8/5</h3>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32" id="about">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              Everything You Need to Volunteer
            </h2>
            <p className="text-lg text-pretty text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our platform provides all the tools to discover opportunities, manage events, and track your community
              impact.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-8 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <CalendarDays className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Event Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create, schedule, and manage volunteer events with ease. Registration and tracking made simple for
                  everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-secondary"></div>
              <CardContent className="p-8 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                  <Users className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Personal Dashboard</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track your volunteer journey, view upcoming activities, and monitor your contribution to the
                  community.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-accent"></div>
              <CardContent className="p-8 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20">
                  <MessageSquare className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Feedback System</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Share your experience through surveys and ratings. Help us improve and make volunteering better for
                  all.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary via-primary/90 to-secondary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
            Ready to Start Making an Impact?
          </h2>
          <p className="text-lg text-pretty text-white/90 leading-relaxed">
            Join thousands of volunteers who are already creating positive change in their communities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" className="rounded-full" asChild>
              <Link to="/signup">
                Join as Volunteer <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
              asChild
            >
              <Link to="/organizer">Become an Organizer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                  <Heart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">VolunteerHub</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering communities through volunteerism and social impact.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/events" className="hover:text-foreground transition-colors">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="hover:text-foreground transition-colors">
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="#" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 VolunteerHub. Built with passion for community impact.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
