import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';
import { AuthPage } from '../pages/Event/AuthPage';
import { EventFeed } from '../pages/Event/EventFeed';
import { OrganizerDashboard } from '../pages/Event/OrganizerDashboard';
import { VolunteerDashboard } from '../pages/Event/VolunteerDashboard';
import { Navbar } from '../components/Navbar'; // Added Import
import { useUserRole } from '../hooks/useUserRole';
import { User, UserRole } from '../types';

// Wrapper to inject user data for Dashboard
const DashboardWithUser = () => {
    const { user, isLoaded } = useUser();
    const { role } = useUserRole();

    if (!isLoaded || !user) return <div className="p-10 text-center">Loading profile...</div>;

    // Construct the User object expected by your components
    const appUser: User = {
        id: user.id,
        name: user.fullName || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        role: (role as UserRole) || UserRole.VOLUNTEER,
        avatar: user.imageUrl,
        bookmarks: (user.unsafeMetadata?.bookmarks as string[]) || [] 
    };

    return role === UserRole.ORGANIZER 
        ? <OrganizerDashboard user={appUser} /> 
        : <VolunteerDashboard user={appUser} />;
}

// Wrapper to inject user data for Feed
const FeedWithUser = () => {
    const { user, isLoaded } = useUser();
    const { role } = useUserRole();

    if (!isLoaded || !user) return <div className="p-10 text-center">Loading feed...</div>;

    const appUser: User = {
        id: user.id,
        name: user.fullName || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        role: (role as UserRole) || UserRole.VOLUNTEER,
        avatar: user.imageUrl,
        bookmarks: (user.unsafeMetadata?.bookmarks as string[]) || []
    };

    return <EventFeed user={appUser} onNavigate={() => {}} />;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            {/* Navbar added here so it renders on all pages */}
            <Navbar />
            
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    {/* Landing Redirect */}
                    <Route path="/" element={<Navigate to="/feed" replace />} />

                    {/* Campus Feed */}
                    <Route path="/feed"
                        element={
                            <>
                                <SignedIn>
                                    <FeedWithUser />
                                </SignedIn>
                                <SignedOut>
                                    <Navigate to="/login" replace />
                                </SignedOut>
                            </>
                        }
                    />

                    {/* Authentication */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />

                    {/* Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                <SignedIn>
                                    <DashboardWithUser />
                                </SignedIn>
                                <SignedOut>
                                    <Navigate to="/login" replace />
                                </SignedOut>
                            </>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    )
}