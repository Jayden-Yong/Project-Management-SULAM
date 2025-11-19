"use client"

import { Button } from "../components/ui"
import { cn } from "../lib/utils"
import { Home, CalendarDays, LayoutDashboard, MessageSquare, Settings, Users, BarChart3, Plus, Heart, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { UserButton } from "@clerk/clerk-react"

import { useState } from "react"

interface SidebarNavProps {
  userType?: "volunteer" | "organizer"
}

export function SidebarNav({ userType = "volunteer" }: SidebarNavProps) {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path;
  const [isOpen, setIsOpen] = useState(false)

  const volunteerRoutes = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/events", label: "Browse Events", icon: CalendarDays },
    { path: "/feedback", label: "Feedback", icon: MessageSquare },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const organizerRoutes = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/organizer", label: "My Events", icon: CalendarDays },
    { path: "/events/create", label: "Create Event", icon: Plus },
    { path: "/organizer/participants", label: "Participants", icon: Users },
    { path: "/organizer/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/organizer/feedback", label: "Feedback", icon: MessageSquare },
    { path: "/settings", label: "Settings", icon: Settings },
  ]

  const routes = userType === "organizer" ? organizerRoutes : volunteerRoutes

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 border-r border-border bg-card transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">VolunteerHub</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {routes.map((route) => {
              const icon = route.icon
              const active = isActive(route.path)
              return (
                <Link key={route.path} to={route.path} onClick={() => setIsOpen(false)}>
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <route.icon className="h-5 w-5 shrink-0" />
                    <span>{route.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Type Badge */}
          <div className="border-t border-border p-4">
            <div className="rounded-xl bg-accent/20 p-3 text-center">
              <p className="text-xs font-medium text-foreground">
                {userType === "organizer" ? "Organizer Account" : "Volunteer Account"}
              </p>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 px-3 py-2 group">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 flex-shrink-0'
                  }
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Profile</p>
                <p className="text-xs text-muted-foreground">Manage account</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
