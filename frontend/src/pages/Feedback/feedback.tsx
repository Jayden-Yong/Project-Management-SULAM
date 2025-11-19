"use client"

import type React from "react"

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Label, Textarea, RadioGroup, RadioGroupItem, Checkbox
 } from "../../components/ui"

import { Heart, Star, CalendarDays, MapPin, ArrowLeft, Send } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

// Sample event for feedback
const eventData = {
  id: 1,
  title: "Beach Cleanup Drive",
  organization: "Ocean Guardians",
  date: "2025-10-28",
  location: "Santa Monica Beach, CA",
  image: "/placeholder.svg?key=beach-feedback",
}

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [formData, setFormData] = useState({
    organization: "",
    communication: "",
    impact: "",
    wouldReturn: "",
    improvements: "",
    highlights: [] as string[],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Feedback submitted:", { rating, ...formData })
    // In a real app, this would submit to an API
  }

  const highlightOptions = [
    "Well organized",
    "Clear instructions",
    "Friendly volunteers",
    "Made an impact",
    "Great location",
    "Good timing",
  ]

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

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-4">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground">Share Your Experience</h1>
          <p className="text-lg text-pretty text-muted-foreground leading-relaxed">
            Your feedback helps us improve and inspire other volunteers to join the cause.
          </p>
        </div>

        {/* Event Info Card */}
        <Card className="mb-8 border-2 rounded-2xl overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img
              src={eventData.image || "/placeholder.svg"}
              alt={eventData.title}
              className="h-full w-full object-cover"
            />
          </div>
          <CardContent className="p-6 space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{eventData.title}</h2>
            <p className="text-muted-foreground">{eventData.organization}</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {new Date(eventData.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{eventData.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <Card className="border-2 rounded-2xl">
            <CardHeader>
              <CardTitle>Overall Rating</CardTitle>
              <CardDescription>How would you rate your overall experience?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-12 w-12 ${
                        star <= (hoverRating || rating) ? "fill-accent-foreground text-accent-foreground" : "text-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {rating === 5 && "Excellent! We're thrilled you had a great experience!"}
                  {rating === 4 && "Great! Thank you for your positive feedback!"}
                  {rating === 3 && "Good! We appreciate your feedback and will work to improve."}
                  {rating === 2 && "We're sorry it wasn't better. Help us improve by sharing more below."}
                  {rating === 1 && "We apologize. Please share what went wrong so we can do better."}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Detailed Feedback */}
          <Card className="border-2 rounded-2xl">
            <CardHeader>
              <CardTitle>Detailed Feedback</CardTitle>
              <CardDescription>Help us understand your experience better</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Organization Quality */}
              <div className="space-y-3">
                <Label>How well was the event organized?</Label>
                <RadioGroup
                  value={formData.organization}
                  onValueChange={(value) => setFormData({ ...formData, organization: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="org-excellent" />
                    <Label htmlFor="org-excellent" className="font-normal cursor-pointer">
                      Excellent - Everything was well-coordinated
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="org-good" />
                    <Label htmlFor="org-good" className="font-normal cursor-pointer">
                      Good - Minor issues but overall smooth
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="org-fair" />
                    <Label htmlFor="org-fair" className="font-normal cursor-pointer">
                      Fair - Some organizational challenges
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="org-poor" />
                    <Label htmlFor="org-poor" className="font-normal cursor-pointer">
                      Poor - Needs significant improvement
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Communication */}
              <div className="space-y-3">
                <Label>How clear was the communication?</Label>
                <RadioGroup
                  value={formData.communication}
                  onValueChange={(value) => setFormData({ ...formData, communication: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-clear" id="comm-clear" />
                    <Label htmlFor="comm-clear" className="font-normal cursor-pointer">
                      Very clear - I knew exactly what to do
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mostly-clear" id="comm-mostly" />
                    <Label htmlFor="comm-mostly" className="font-normal cursor-pointer">
                      Mostly clear - A few unclear moments
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unclear" id="comm-unclear" />
                    <Label htmlFor="comm-unclear" className="font-normal cursor-pointer">
                      Unclear - I was confused at times
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Impact Feeling */}
              <div className="space-y-3">
                <Label>Did you feel your contribution made a difference?</Label>
                <RadioGroup
                  value={formData.impact}
                  onValueChange={(value) => setFormData({ ...formData, impact: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="definitely" id="impact-def" />
                    <Label htmlFor="impact-def" className="font-normal cursor-pointer">
                      Definitely - I saw the positive impact
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="probably" id="impact-prob" />
                    <Label htmlFor="impact-prob" className="font-normal cursor-pointer">
                      Probably - I believe it helped
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unsure" id="impact-unsure" />
                    <Label htmlFor="impact-unsure" className="font-normal cursor-pointer">
                      Unsure - Hard to tell the impact
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="impact-no" />
                    <Label htmlFor="impact-no" className="font-normal cursor-pointer">
                      No - Didn't feel impactful
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Highlights */}
          <Card className="border-2 rounded-2xl">
            <CardHeader>
              <CardTitle>Event Highlights</CardTitle>
              <CardDescription>What stood out to you? (Select all that apply)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {highlightOptions.map((highlight) => (
                  <div key={highlight} className="flex items-center space-x-2">
                    <Checkbox
                      id={highlight}
                      checked={formData.highlights.includes(highlight)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, highlights: [...formData.highlights, highlight] })
                        } else {
                          setFormData({ ...formData, highlights: formData.highlights.filter((h) => h !== highlight) })
                        }
                      }}
                    />
                    <Label htmlFor={highlight} className="font-normal cursor-pointer">
                      {highlight}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Would Return */}
          <Card className="border-2 rounded-2xl">
            <CardHeader>
              <CardTitle>Future Participation</CardTitle>
              <CardDescription>Would you volunteer with this organization again?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.wouldReturn}
                onValueChange={(value) => setFormData({ ...formData, wouldReturn: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="definitely" id="return-def" />
                  <Label htmlFor="return-def" className="font-normal cursor-pointer">
                    Definitely - I'll be back!
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="probably" id="return-prob" />
                  <Label htmlFor="return-prob" className="font-normal cursor-pointer">
                    Probably - Likely to return
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="return-maybe" />
                  <Label htmlFor="return-maybe" className="font-normal cursor-pointer">
                    Maybe - Need to think about it
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="return-no" />
                  <Label htmlFor="return-no" className="font-normal cursor-pointer">
                    No - Not planning to return
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Additional Comments */}
          <Card className="border-2 rounded-2xl">
            <CardHeader>
              <CardTitle>Additional Comments</CardTitle>
              <CardDescription>Share any suggestions or thoughts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="improvements">What could be improved?</Label>
                <Textarea
                  id="improvements"
                  placeholder="Share your suggestions for making future events even better..."
                  className="min-h-24 resize-none"
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1 rounded-full" disabled={rating === 0}>
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
            <Button type="button" variant="outline" size="lg" className="rounded-full bg-transparent" asChild>
              <Link to="/dashboard">Skip</Link>
            </Button>
          </div>

          {rating === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Please provide an overall rating to submit your feedback
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
