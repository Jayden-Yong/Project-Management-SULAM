import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { getEvent, joinEvent } from '../../services/api'; // Ensure getEventById exists or create it
import { Event } from '../../types';
import { useUserRole } from '../../hooks/useUserRole';
import { PageLoader } from '../../components/PageLoader';

export const EventDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useUser();
    const { isOrganizer } = useUserRole();

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const loadEvent = async () => {
            try {
                // Assuming getEventById fetches a single event.
                // If it doesn't exist in api.ts, I'll need to check or use getEvents and filter (less ideal).
                // Let's assume for now api.ts might need an update if this endpoint is missing,
                // allows use existing getEvents with a filter if needed, but getEventById is standard.
                // Checking api.ts next.
                const data = await getEvent(id);
                setEvent(data);
            } catch (err) {
                console.error("Failed to load event details", err);
                setError("Failed to load event. It might have been deleted.");
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [id]);

    const handleJoin = async () => {
        if (!user || !event) return;
        if (!confirm("Confirm registration?")) return;

        try {
            await joinEvent(event.id, user.id, user.fullName || "Volunteer", user.imageUrl);
            alert("Successfully registered!");
            // Optionally refresh state
        } catch (err: any) {
            alert(err.response?.data?.detail || "Failed to join.");
        }
    };

    if (loading) return <PageLoader />;
    if (error || !event) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <p className="text-red-500 mb-4">{error || "Event not found"}</p>
            <button onClick={() => navigate(-1)} className="text-primary-600 underline">Go Back</button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
            <button onClick={() => navigate(-1)} className="mb-6 text-slate-500 hover:text-slate-800 flex items-center gap-2">
                ← Back to Feed
            </button>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Banner */}
                <div className="h-64 sm:h-80 bg-slate-200 relative">
                    {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-6xl">📅</div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {event.category}
                    </div>
                </div>

                <div className="p-6 sm:p-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">{event.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    🗓 {new Date(event.date).toLocaleDateString('en-GB', { dateStyle: 'full' })}
                                </span>
                                <span className="flex items-center gap-1">
                                    📍 {event.location}
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        {!isOrganizer && event.status === 'upcoming' && (
                            <button
                                onClick={handleJoin}
                                disabled={event.currentVolunteers >= event.maxVolunteers}
                                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
                            >
                                {event.currentVolunteers >= event.maxVolunteers ? 'Full Capacity' : 'Join Event'}
                            </button>
                        )}
                        {isOrganizer && (
                            <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                                You are viewing as Organizer
                            </div>
                        )}
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <h3>About this Event</h3>
                        <p className="whitespace-pre-line text-slate-600 leading-relaxed">
                            {event.description}
                        </p>

                        {event.tasks && (
                            <>
                                <h3 className="mt-8">Tasks & Responsibilities</h3>
                                <ul className="list-disc pl-5 text-slate-600">
                                    {event.tasks.split('\n').map((task, i) => (
                                        <li key={i}>{task}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
