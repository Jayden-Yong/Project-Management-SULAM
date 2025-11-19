import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { RoleSetter } from '../components/RoleSetter'
import HomePage from '../pages/Landing/landing'
import LoginPage from '../pages/Auth/login'
import SSOCallback from '../pages/Auth/sso-callback'
import DashboardPage from '../pages/Dashboard/dashboard'
import EventsPage from '../pages/Events/events'
import CreateEventPage from '../pages/Events/create/create-event'
import EventDetailsPage from '../pages/Events/event-details/details'
import SignupPage from '../pages/Auth/signup'
import FeedbackPage from '../pages/Feedback/feedback'
import FeedbackSuccessPage from '../pages/Feedback/success/feedback-success'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* root */}
                <Route path="/"
                    element={<HomePage />}
                />

                {/* events */}
                <Route path="/events"
                    element={<EventsPage />}
                />

                {/* auth */}
                <Route path="/login"
                    element={<LoginPage />}
                />
                <Route path="/signup"
                    element={<SignupPage />}
                />
                <Route path="/sso-callback"
                    element={<SSOCallback />}
                />

                {/* protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <SignedIn>
                                <RoleSetter>
                                    <DashboardPage />
                                </RoleSetter>
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/" replace />
                            </SignedOut>
                        </>
                    }
                />

                <Route
                    path="/events/create"
                    element={
                        <>
                            <SignedIn>
                                <CreateEventPage />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/login" replace />
                            </SignedOut>
                        </>
                    }
                />

                <Route
                    path="/events/:eventId"
                    element={
                        <>
                            <SignedIn>
                                <EventDetailsPage />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/login" replace />
                            </SignedOut>
                        </>
                    }
                />

                <Route
                    path="/feedback"
                    element={
                        <>
                            <SignedIn>
                                <FeedbackPage />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/" replace />
                            </SignedOut>
                        </>
                    }
                />

                <Route
                    path="/feedback/success"
                    element={
                        <>
                            <SignedIn>
                                <FeedbackSuccessPage />
                            </SignedIn>
                            <SignedOut>
                                <Navigate to="/" replace />
                            </SignedOut>
                        </>
                    }
                />

            </Routes>
        </BrowserRouter>
    )
}