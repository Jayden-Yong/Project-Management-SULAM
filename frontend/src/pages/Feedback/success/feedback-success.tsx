import { Button, Card, CardContent } from "../../../components/ui"
import { Heart, CheckCircle2, Home, CalendarDays } from "lucide-react"
import { Link } from "react-router-dom"

export default function FeedbackSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">VolunteerHub</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="border-2 rounded-3xl overflow-hidden">
          <CardContent className="p-12 text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground">
                Thank You for Your Feedback!
              </h1>
              <p className="text-lg text-pretty text-muted-foreground leading-relaxed max-w-md mx-auto">
                Your insights help us improve and inspire other volunteers to make a difference.
              </p>
            </div>

            <div className="rounded-2xl bg-accent/10 p-6 space-y-2">
              <p className="font-medium text-foreground">Impact Achievement Unlocked!</p>
              <p className="text-sm text-muted-foreground">
                You've earned 10 points for sharing your experience. Keep making a difference!
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-center">
              <Button size="lg" className="rounded-full" asChild>
                <Link to="/events">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Browse Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full bg-transparent" asChild>
                <Link to="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mt-12 space-y-4">
          <h2 className="text-center text-xl font-bold text-foreground">What's Next?</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-2 rounded-2xl hover:border-primary transition-colors">
              <CardContent className="p-6 text-center space-y-2">
                <div className="text-3xl">🎯</div>
                <h3 className="font-bold text-foreground">Set Goals</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Track your volunteer hours and impact</p>
              </CardContent>
            </Card>

            <Card className="border-2 rounded-2xl hover:border-primary transition-colors">
              <CardContent className="p-6 text-center space-y-2">
                <div className="text-3xl">🤝</div>
                <h3 className="font-bold text-foreground">Invite Friends</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Share the volunteering experience</p>
              </CardContent>
            </Card>

            <Card className="border-2 rounded-2xl hover:border-primary transition-colors">
              <CardContent className="p-6 text-center space-y-2">
                <div className="text-3xl">⭐</div>
                <h3 className="font-bold text-foreground">Earn Badges</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Unlock achievements as you volunteer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
