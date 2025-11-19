import { 
  Button,Card, CardContent, CardDescription, CardHeader, CardTitle, Badge,
  Tabs, TabsContent, TabsList, TabsTrigger,
  Avatar, AvatarFallback, AvatarImage, Progress,
 } from "../../components/ui"

import { SidebarNav } from "../../components/sidebar-nav"
import { Heart, CalendarDays, Clock, MapPin, TrendingUp, Award, Star } from 'lucide-react'
import { Link } from "react-router-dom"

// Sample user data
const userData = {
  name: "Alex Johnson",
  avatar: "/placeholder.svg?key=user-avatar",
  role: "volunteer",
  stats: {
    totalHours: 127,
    eventsAttended: 23,
    impactScore: 4.8,
    rank: "Gold Contributor",
  },
  upcomingEvents: [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      date: "2025-11-15",
      time: "9:00 AM",
      location: "Santa Monica Beach",
      image: "/placeholder.svg?key=beach",
    },
    {
      id: 2,
      title: "Food Bank Sorting",
      date: "2025-11-18",
      time: "2:00 PM",
      location: "Downtown Community Center",
      image: "/placeholder.svg?key=food",
    },
  ],
  completedEvents: [
    {
      id: 3,
      title: "Park Restoration Project",
      date: "2025-10-28",
      hours: 5,
      rating: 5,
      image: "/placeholder.svg?key=park",
    },
    {
      id: 4,
      title: "Senior Care Visit",
      date: "2025-10-22",
      hours: 4,
      rating: 5,
      image: "/placeholder.svg?key=senior",
    },
    {
      id: 5,
      title: "Reading Buddies Program",
      date: "2025-10-15",
      hours: 2,
      rating: 4,
      image: "/placeholder.svg?key=reading",
    },
  ],
  achievements: [
    { name: "Early Bird", description: "Attended 10+ morning events", icon: "🌅" },
    { name: "Team Player", description: "Volunteered with 5+ organizations", icon: "🤝" },
    { name: "Century Club", description: "Completed 100+ volunteer hours", icon: "💯" },
  ],
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav userType="volunteer" />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60">
          <div className="flex h-16 items-center gap-4 px-6">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">My Dashboard</h1>
            </div>
            <Button className="rounded-full" asChild>
              <Link to="/events">Find Events</Link>
            </Button>
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* Profile Header */}
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-4 border-primary">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback className="text-2xl">{userData.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{userData.name}</h1>
                <Badge className="rounded-full" variant="secondary">
                  {userData.stats.rank}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full bg-transparent">
                Edit Profile
              </Button>
              <Button className="rounded-full" asChild>
                <Link to="/events">Find Events</Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 rounded-2xl">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{userData.stats.totalHours}</p>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12 this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 rounded-2xl">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                  <CalendarDays className="h-4 w-4 text-secondary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{userData.stats.eventsAttended}</p>
                <div className="flex items-center gap-1 text-xs text-secondary">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3 this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 rounded-2xl">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Impact Score</p>
                  <Star className="h-4 w-4 text-accent-foreground" />
                </div>
                <p className="text-3xl font-bold text-foreground">{userData.stats.impactScore}</p>
                <Progress value={96} className="h-1" />
              </CardContent>
            </Card>

            <Card className="border-2 rounded-2xl">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground">{userData.achievements.length}</p>
                <p className="text-xs text-muted-foreground">Badges earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Upcoming Events */}
            <TabsContent value="upcoming" className="space-y-4">
              <Card className="border-2 rounded-2xl">
                <CardHeader>
                  <CardTitle>Your Upcoming Events</CardTitle>
                  <CardDescription>Events you're registered for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex gap-4 rounded-xl border-2 border-border p-4 hover:border-primary transition-colors"
                    >
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="outline" size="sm" className="rounded-full bg-transparent" asChild>
                          <Link to={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History */}
            <TabsContent value="history" className="space-y-4">
              <Card className="border-2 rounded-2xl">
                <CardHeader>
                  <CardTitle>Completed Events</CardTitle>
                  <CardDescription>Your volunteer history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userData.completedEvents.map((event) => (
                    <div key={event.id} className="flex gap-4 rounded-xl border-2 border-border p-4">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-bold text-foreground">{event.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.hours} hours</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-accent-foreground text-accent-foreground" />
                            <span>{event.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements" className="space-y-4">
              <Card className="border-2 rounded-2xl">
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Badges you've earned through your dedication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {userData.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 rounded-xl border-2 border-border bg-accent/10 p-4"
                      >
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-foreground">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
