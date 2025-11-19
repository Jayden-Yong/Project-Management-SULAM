import { Button, Card, CardContent, Badge, Input } from "../../components/ui"
import { CalendarDays, Clock, MapPin, Users, Search, Filter, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { SignedIn, SignedOut } from "@clerk/clerk-react"

// Sample event data
const events = [
  {
    id: 1,
    title: "Beach Cleanup Drive",
    organization: "Ocean Guardians",
    date: "2025-11-15",
    time: "9:00 AM - 12:00 PM",
    location: "Santa Monica Beach, CA",
    volunteers: 45,
    maxVolunteers: 60,
    category: "Environment",
    image: "/beach-cleanup-volunteers.png",
    description: "Join us for a morning of coastal conservation and community impact.",
  },
  {
    id: 2,
    title: "Food Bank Sorting",
    organization: "Community Kitchen",
    date: "2025-11-18",
    time: "2:00 PM - 5:00 PM",
    location: "Downtown Community Center",
    volunteers: 28,
    maxVolunteers: 30,
    category: "Food Security",
    image: "/food-bank-volunteers-sorting.jpg",
    description: "Help sort and pack food donations for families in need.",
  },
  {
    id: 3,
    title: "Reading Buddies Program",
    organization: "Literacy First",
    date: "2025-11-20",
    time: "3:30 PM - 5:30 PM",
    location: "Lincoln Elementary School",
    volunteers: 15,
    maxVolunteers: 20,
    category: "Education",
    image: "/children-reading-books-with-volunteers.jpg",
    description: "Mentor young readers and help build literacy skills.",
  },
  {
    id: 4,
    title: "Senior Care Visit",
    organization: "Golden Years Foundation",
    date: "2025-11-22",
    time: "10:00 AM - 2:00 PM",
    location: "Sunshine Senior Living",
    volunteers: 12,
    maxVolunteers: 15,
    category: "Healthcare",
    image: "/volunteers-with-seniors-in-care-home.jpg",
    description: "Spend quality time with seniors through activities and conversation.",
  },
  {
    id: 5,
    title: "Park Restoration Project",
    organization: "Green City Initiative",
    date: "2025-11-25",
    time: "8:00 AM - 1:00 PM",
    location: "Riverside Park",
    volunteers: 38,
    maxVolunteers: 50,
    category: "Environment",
    image: "/volunteers-planting-trees-in-park.jpg",
    description: "Plant native species and restore natural habitats in our local park.",
  },
  {
    id: 6,
    title: "Coding Workshop for Kids",
    organization: "Tech for All",
    date: "2025-11-28",
    time: "1:00 PM - 4:00 PM",
    location: "Tech Hub Downtown",
    volunteers: 10,
    maxVolunteers: 12,
    category: "Education",
    image: "/kids-learning-coding-with-volunteers.jpg",
    description: "Teach basic coding skills to underserved youth in our community.",
  },
]

export default function EventsPage() {
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
              <SignedIn>
                <Button variant="ghost" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </SignedIn>
              <Button className="rounded-full" asChild>
                <Link to="/events/create">Create Event</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground">Discover Events</h1>
          <p className="text-lg text-pretty text-muted-foreground leading-relaxed">
            Find volunteer opportunities that match your interests and make a difference in your community.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search events by name, organization, or location..." className="pl-10 rounded-full" />
          </div>
          <Button variant="outline" className="rounded-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Badge variant="secondary" className="cursor-pointer px-4 py-2 rounded-full">
            All Events
          </Badge>
          <Badge variant="outline" className="cursor-pointer px-4 py-2 rounded-full hover:bg-accent">
            Environment
          </Badge>
          <Badge variant="outline" className="cursor-pointer px-4 py-2 rounded-full hover:bg-accent">
            Education
          </Badge>
          <Badge variant="outline" className="cursor-pointer px-4 py-2 rounded-full hover:bg-accent">
            Healthcare
          </Badge>
          <Badge variant="outline" className="cursor-pointer px-4 py-2 rounded-full hover:bg-accent">
            Food Security
          </Badge>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden rounded-2xl border-2 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-3 right-3 rounded-full bg-background/90 text-foreground border">
                  {event.category}
                </Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground line-clamp-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.organization}</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.volunteers}/{event.maxVolunteers} volunteers
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button asChild className="w-full rounded-full">
                    <Link to={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
