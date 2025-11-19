"use client"

import type React from "react"

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle,
  Input, Label, Textarea, 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
 } from "../../../components/ui"

import { Heart, ArrowLeft, CalendarDays, MapPin, Users, FileText } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    maxVolunteers: "",
    description: "",
    requirements: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Event created:", formData)
    // In a real app, this would submit to an API
  }

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
                <Link to="/events">View Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 -ml-4">
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground">Create New Event</h1>
          <p className="text-lg text-pretty text-muted-foreground leading-relaxed">
            Organize a volunteer event and bring your community together for positive impact.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2 rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Tell us about your event</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="Beach Cleanup Drive"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="food-security">Food Security</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event, what volunteers will do, and the impact it will create..."
                  className="min-h-32 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Date & Location */}
          <Card className="border-2 rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                  <CalendarDays className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle>Date & Location</CardTitle>
                  <CardDescription>When and where will this happen?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="123 Main St, City, State"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volunteer Details */}
          <Card className="border-2 rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                  <Users className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>Volunteer Details</CardTitle>
                  <CardDescription>Requirements and capacity</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxVolunteers">Maximum Volunteers *</Label>
                <Input
                  id="maxVolunteers"
                  type="number"
                  placeholder="50"
                  min="1"
                  value={formData.maxVolunteers}
                  onChange={(e) => setFormData({ ...formData, maxVolunteers: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements & What to Bring</Label>
                <Textarea
                  id="requirements"
                  placeholder="Age requirements, physical abilities, items to bring, etc."
                  className="min-h-24 resize-none"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1 rounded-full">
              Create Event
            </Button>
            <Button type="button" variant="outline" size="lg" className="rounded-full bg-transparent" asChild>
              <Link to="/events">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
