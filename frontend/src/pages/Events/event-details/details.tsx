import { Button, Card, CardContent, CardHeader, CardTitle, Badge,
  Avatar, AvatarFallback, AvatarImage, Separator,
 } from "../../../components/ui"

import { CalendarDays, Clock, MapPin, Users, Heart, Share2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Link } from "react-router-dom"

// Sample event data (in a real app, this would come from a database)
const eventData = {
  id: 1,
  title: "Beach Cleanup Drive",
  organization: "Ocean Guardians",
  date: "2025-11-15",
  time: "9:00 AM - 12:00 PM",
  location: "Santa Monica Beach, CA",
  volunteers: 45,
  maxVolunteers: 60,
  category: "Environment",
  image: "/beach-cleanup-volunteers-working-together.jpg",
  description:
    "Join us for a meaningful morning of coastal conservation and community impact. We'll be cleaning Santa Monica Beach, collecting plastic waste, and protecting marine life habitats. This event is perfect for individuals, families, and groups who want to make a tangible difference in ocean health.",
  fullDescription: `Our Beach Cleanup Drive is more than just picking up trash—it's about building a sustainable future for our oceans and marine ecosystems. 

What to Expect:
- Hands-on beach cleaning activities
- Education about ocean conservation
- Team-building with fellow volunteers
- Refreshments and snacks provided
- Certificate of participation

What to Bring:
- Comfortable clothing and closed-toe shoes
- Sunscreen and hat
- Reusable water bottle
- Positive attitude and enthusiasm

Impact:
Last year, our volunteers collected over 2,000 pounds of waste from local beaches, preventing harmful materials from entering our oceans. Your participation helps protect marine wildlife and keep our coastlines beautiful for future generations.`,
  requirements: [
    "Must be 16+ years old (or accompanied by an adult)",
    "Able to walk on sandy terrain",
    "Comfortable working outdoors",
  ],
  skills: ["No special skills required", "Training provided on-site"],
  organizer: {
    name: "Ocean Guardians",
    avatar: "/ocean-conservation-logo.jpg",
    description: "Dedicated to protecting marine ecosystems through community action and education.",
    eventsHosted: 47,
    volunteersReached: 2800,
  },
}

export default function EventDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">VolunteerHub</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-4">
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        {/* Hero Image */}
        <div className="mb-8 overflow-hidden rounded-3xl">
          <img src={eventData.image || "/placeholder.svg"} alt={eventData.title} className="h-96 w-full object-cover" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-4">
              <Badge className="rounded-full">{eventData.category}</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground">{eventData.title}</h1>
              <p className="text-lg text-pretty text-muted-foreground leading-relaxed">{eventData.description}</p>
            </div>

            <Separator />

            {/* Event Details */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Event Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(eventData.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Time</p>
                    <p className="text-sm text-muted-foreground">{eventData.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                    <MapPin className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">{eventData.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Volunteers</p>
                    <p className="text-sm text-muted-foreground">
                      {eventData.volunteers}/{eventData.maxVolunteers} registered
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Full Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">About This Event</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {eventData.fullDescription}
              </div>
            </div>

            <Separator />

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Requirements</h2>
              <ul className="space-y-2">
                {eventData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Skills & Training</h2>
              <div className="flex flex-wrap gap-2">
                {eventData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="rounded-full px-4 py-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Organizer Info */}
            <Card className="border-2 rounded-2xl">
              <CardHeader>
                <CardTitle>About the Organizer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={eventData.organizer.avatar || "/placeholder.svg"}
                      alt={eventData.organizer.name}
                    />
                    <AvatarFallback>{eventData.organizer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{eventData.organizer.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{eventData.organizer.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{eventData.organizer.eventsHosted}</p>
                    <p className="text-sm text-muted-foreground">Events Hosted</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{eventData.organizer.volunteersReached}</p>
                    <p className="text-sm text-muted-foreground">Volunteers Reached</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2 rounded-2xl">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Spots Available</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-foreground">
                      {eventData.maxVolunteers - eventData.volunteers}
                    </p>
                    <p className="text-sm text-muted-foreground pb-1">/ {eventData.maxVolunteers}</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(eventData.volunteers / eventData.maxVolunteers) * 100}%` }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full rounded-full" size="lg">
                    Register Now
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="rounded-full bg-transparent" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" className="rounded-full bg-transparent" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <p className="font-medium text-foreground">Quick Info</p>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Registration Deadline:</span>
                      <span className="font-medium text-foreground">Nov 14, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age Requirement:</span>
                      <span className="font-medium text-foreground">16+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium text-foreground">3 hours</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
