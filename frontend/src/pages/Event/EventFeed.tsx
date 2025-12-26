import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getEvents, getUserBookmarks, toggleBookmark, joinEvent } from '../../services/api';
import { Event } from '../../types';
import { useUserRole } from '../../hooks/useUserRole';

const LIMIT = 12;

// ============================================================================
// COMPONENT: EVENT FEED
// ============================================================================

export const EventFeed: React.FC = () => {
  const { user } = useUser();
  // Get role to conditionally render buttons
  const { isOrganizer } = useUserRole();

  // --- State: Data ---
  const [events, setEvents] = useState<Event[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);

  // --- State: UI & Loading ---
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // --- State: Error Handling (Safety Net) ---
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // --- Filtering State ---
  const [statusFilter, setStatusFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ==========================================================================
  // DATA FETCHING
  // ==========================================================================

  const loadEvents = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      if (!isLoadMore) setError(null);
      const skip = isLoadMore ? events.length : 0;

      // Parallel Fetch: Get events (public) AND bookmarks (user-specific)
      const [newEvents, bookmarksData] = await Promise.all([
        getEvents(statusFilter, categoryFilter, debouncedSearch, skip, LIMIT),
        // Only fetch bookmarks on initial load if user is logged in
        (!isLoadMore && user?.id) ? getUserBookmarks(user.id) : Promise.resolve(null)
      ]);

      if (bookmarksData) setUserBookmarks(bookmarksData as string[]);

      if (isLoadMore) {
        setEvents(prev => [...prev, ...newEvents]);
      } else {
        setEvents(newEvents);
      }

      setHasMore(newEvents.length === LIMIT);
      setRetryCount(0); // Reset retry logic on success

    } catch (e: any) {
      console.error("Failed to load feed", e);

      // --- STABILITY SAFETY NET ---
      // Automatically retry a few times if the backend is waking up (Render Cold Start)
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadEvents(isLoadMore), 3000); // Retry after 3s
      } else {
        setError("The server is taking a moment to wake up. Please wait 30 seconds and refresh.");
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Trigger fetch when filters change
  useEffect(() => {
    loadEvents(false);
  }, [statusFilter, categoryFilter, debouncedSearch, user?.id]);

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  const handleBookmark = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!user) return alert("Please sign in to save events");

    // Optimistic UI Update
    const isBookmarked = userBookmarks.includes(eventId);
    setUserBookmarks(prev => isBookmarked ? prev.filter(id => id !== eventId) : [...prev, eventId]);

    try {
      await toggleBookmark(user.id, eventId);
    } catch (err) {
      alert("Failed to save bookmark");
      loadEvents(false); // Revert on failure
    }
  };

  const handleJoin = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!user) return alert("Please sign in to join");
    if (isOrganizer) return alert("Organizers cannot join events via this button.");

    if (confirm("Confirm your registration for this event?")) {
      try {
        await joinEvent(eventId, user.id, user.fullName || "Volunteer", user.imageUrl);
        alert("Registration Successful!");
        loadEvents(false); // Refresh to update counts
      } catch (err: any) {
        alert(err.response?.data?.detail || "Failed to join event");
      }
    }
  };

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  const categories = ['All', 'Campus Life', 'Education', 'Environment', 'Welfare'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 min-h-screen">

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campus Bulletin</h1>
        <p className="text-slate-500 mt-1">Discover volunteering opportunities at Universiti Malaya</p>
      </div>

      {/* --- Error / Loading State (Safety Net UI) --- */}
      {error && !loading && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-700 animate-fade-in">
          <span className="text-xl">⏳</span>
          <div>
            <p className="text-sm font-bold">Connecting to server...</p>
            <p className="text-xs opacity-80">{error}</p>
          </div>
          <button
            onClick={() => loadEvents(false)}
            className="ml-auto bg-orange-100 px-3 py-1 rounded-lg text-xs font-bold hover:bg-orange-200 transition-colors"
          >
            Retry Now
          </button>
        </div>
      )}

      {/* --- Filter & Search Bar --- */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-2xl p-2 mb-8 flex flex-col md:flex-row gap-2">

        {/* Status Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex shrink-0">
          {['upcoming', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${statusFilter === status ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Dropdown (Mobile optimized) */}
        <div className="md:w-48">
          <select
            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500 cursor-pointer"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* --- Events Grid --- */}
      {loading && events.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No events found.</p>
          <p className="text-xs text-slate-300 mt-2">Debug: {statusFilter} | {categoryFilter} | Org: {isOrganizer ? 'Yes' : 'No'}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-primary-600 text-sm font-bold hover:underline">Refresh Page</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => window.location.href = `/events/${event.id}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Image Banner */}
              <div className="relative h-48 bg-slate-200 overflow-hidden">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                    <span className="text-4xl">📅</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm">
                  {event.category}
                </div>

                {/* Bookmark Button (Hidden for Organizer) */}
                {!isOrganizer && (
                  <button
                    onClick={(e) => handleBookmark(e, event.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors active:scale-95"
                  >
                    {userBookmarks.includes(event.id) ? '❤️' : '🤍'}
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                    {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {event.status === 'completed' && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase">Completed</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary-700 transition-colors">
                  {event.title}
                </h3>

                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                  📍 <span className="truncate">{event.location}</span>
                </p>

                {/* Footer Analysis: Participation Bar */}
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-700">{event.currentVolunteers} / {event.maxVolunteers} Volunteers</span>
                    <span className="text-slate-400 font-medium">
                      {Math.round((event.currentVolunteers / event.maxVolunteers) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${event.currentVolunteers >= event.maxVolunteers ? 'bg-red-500' : 'bg-primary-500'
                        }`}
                      style={{ width: `${Math.min(100, (event.currentVolunteers / event.maxVolunteers) * 100)}%` }}
                    />
                  </div>

                  {/* Join Button (Only for Volunteer Role) */}
                  {statusFilter === 'upcoming' && !isOrganizer && (
                    <button
                      onClick={(e) => handleJoin(e, event.id)}
                      disabled={event.currentVolunteers >= event.maxVolunteers}
                      className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-slate-200"
                    >
                      {event.currentVolunteers >= event.maxVolunteers ? 'Full Capacity' : 'Join Now'}
                    </button>
                  )}

                  {/* Organizer View (View Details Only) */}
                  {statusFilter === 'upcoming' && isOrganizer && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/events/${event.id}`;
                      }}
                      className="w-full mt-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Load More Button --- */}
      {hasMore && !loading && events.length > 0 && (
        <div className="text-center pb-12">
          <button
            onClick={() => loadEvents(true)}
            disabled={loadingMore}
            className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
          >
            {loadingMore ? 'Loading...' : 'Show More Events'}
          </button>
        </div>
      )}
    </div>
  );
};
