import React, { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { getEvents, getUserBookmarks, joinEvent, toggleBookmark, getUserRegistrations, getEvent } from '../../services/api';
import { Event, User, UserRole, Registration } from '../../types';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { EventDetailsModal } from './components/EventDetailsModal';

interface Props {
  user: User | null;
  onNavigate: (page: string) => void;
}

export const EventFeed: React.FC<Props> = ({ user, onNavigate }) => {
  const LIMIT = 6;

  // --- Filtering State ---
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce Search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Interactive State
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

  // 1. Fetch Events Query
  const {
    data: events = [],
    isLoading: isLoadingEvents,
    isFetching: isFetchingEvents
  } = useQuery({
    queryKey: ['events', 'upcoming', categoryFilter, locationFilter, debouncedSearch],
    queryFn: () => getEvents('upcoming', categoryFilter, locationFilter, debouncedSearch, 0, 100),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  // 2. Fetch User Bookmarks
  const { data: bookmarksData = [] } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: () => user ? getUserBookmarks(user.id) : Promise.resolve([]),
    enabled: !!user,
  });

  // Sync bookmarks to local state for optimistic updates
  useEffect(() => {
    if (bookmarksData) setUserBookmarks(bookmarksData as string[]);
  }, [bookmarksData]);

  // 3a. Fetch User Registrations (to show status joined/approved)
  const { data: registrations = [], refetch: refetchRegistrations } = useQuery({
    queryKey: ['registrations', user?.id],
    queryFn: () => user ? getUserRegistrations(user.id) : Promise.resolve([]),
    enabled: !!user
  });

  // Modal State
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventData, setSelectedEventData] = useState<Event | null>(null);

  // Fetch single event details when modal opens (ensures we get private links if approved)
  const { data: fullEventDetails } = useQuery({
    queryKey: ['event', selectedEventId],
    queryFn: () => selectedEventId ? getEvent(selectedEventId) : Promise.resolve(null),
    enabled: !!selectedEventId
  });

  const handleOpenDetails = (eventId: string) => {
    setSelectedEventId(eventId);
    // Optimistically show current list data while fetching full data
    const listEvent = events.find(e => e.id === eventId) || null;
    setSelectedEventData(listEvent);
  };

  // Update modal data when full details arrive
  useEffect(() => {
    if (fullEventDetails) setSelectedEventData(fullEventDetails);
  }, [fullEventDetails]);

  const handleCloseDetails = () => {
    setSelectedEventId(null);
    setSelectedEventData(null);
  }

  const loading = isLoadingEvents;

  // 3. User Actions
  const handleJoin = async (eventId: string) => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    setJoiningId(eventId);
    try {
      await joinEvent(
        eventId,
        user.id,
        user.name || "Student",
        user.avatar || ""
      );
      alert('Request sent! Waiting for organizer approval.');
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to join");
    } finally {
      setJoiningId(null);
    }
  };

  const handleBookmark = async (eventId: string) => {
    if (!user) return onNavigate('auth');

    // Optimistic UI Update
    const isCurrentlyBookmarked = userBookmarks.includes(eventId);
    const newBookmarksList = isCurrentlyBookmarked
      ? userBookmarks.filter(id => id !== eventId)
      : [...userBookmarks, eventId];

    setUserBookmarks(newBookmarksList);
    setBookmarkingId(eventId);

    try {
      await toggleBookmark(user.id, eventId);
    } catch (e) {
      console.error("Bookmark failed", e);
      // Revert on failure
      setUserBookmarks(userBookmarks);
    } finally {
      setBookmarkingId(null);
    }
  };

  // 4. Client-side Location Filtering (REMOVED - now handled by Backend)
  const displayedEvents = events.filter(e => {
    // Hide events where quota is full
    if (e.currentVolunteers >= e.maxVolunteers) return false;
    return true;
  });


  // --- RENDER HELPERS ---
  const isOrganizer = user?.role === UserRole.ORGANIZER;
  const categories = ['All', 'Campus Life', 'Education', 'Environment', 'Welfare'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 animate-fade-in-up">

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Campus Bulletin</h1>
        <p className="text-slate-500 mt-1">Happening around Universiti Malaya</p>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-16 -mx-4 px-4 py-3 bg-gray-50/95 backdrop-blur-md z-30 border-b border-gray-200/50 mb-6 space-y-3 shadow-sm">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search activities..."
            className="w-full pl-11 pr-4 h-12 rounded-xl bg-white border-none shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
        </div>

        {/* Chips */}
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          <select
            className="h-10 px-4 rounded-full bg-white ring-1 ring-gray-200 text-sm font-medium text-slate-700 outline-none flex-shrink-0"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="All">🗺️ Anywhere in UM</option>
            <option value="Residential College">🏠 Residential Colleges</option>
            <option value="Faculty">🏫 Faculties</option>
            <option value="Outdoor">🌲 Outdoors</option>
            <option value="Other">📍 Other</option>
          </select>

          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`h-10 px-5 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${categoryFilter === c
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-slate-600 ring-1 ring-gray-200 hover:bg-gray-50'
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards */}
      {loading && events.length === 0 ? (
        <div className="space-y-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : displayedEvents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-900 font-medium">No events found</p>
          <p className="text-slate-400 text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div key={categoryFilter + locationFilter + debouncedSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {displayedEvents.map((event) => {
            const isFull = event.currentVolunteers >= event.maxVolunteers;
            const isBookmarked = userBookmarks.includes(event.id);
            const isMyEvent = isOrganizer && user?.id === event.organizerId;
            const day = event.date.split('-')[2];
            const month = new Date(event.date).toLocaleString('default', { month: 'short' });

            return (
              <div key={event.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                {event.imageUrl && (
                  <div className="h-48 w-full overflow-hidden relative">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-white/50">
                        {event.category}
                      </div>
                      {!isOrganizer && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBookmark(event.id); }}
                          className={`w-10 h-10 flex items-center justify-center rounded-full shadow-sm transition-all active:scale-90 ${isBookmarked ? 'bg-red-500 text-white' : 'bg-white text-slate-400 hover:text-red-500'}`}
                        >
                          {bookmarkingId === event.id ? '...' : (isBookmarked ? '♥' : '♡')}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex gap-4 mb-3">
                    <div className="flex flex-col items-center justify-center bg-primary-50 rounded-xl w-14 h-14 border border-primary-100 text-primary-700 shrink-0">
                      <span className="text-[10px] font-bold uppercase">{month}</span>
                      <span className="text-xl font-bold leading-none">{day}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2 md:text-base lg:text-lg">{event.title}</h3>
                      <div className="text-xs font-medium text-primary-600 mt-1 truncate">{event.organizerName}</div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">{event.description}</p>

                  {/* Show tasks if available - Hide on smaller cards if needed, keeping for now */}
                  {event.tasks && (
                    <div className="mb-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                      <span className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Volunteer Roles</span>
                      <p className="text-xs text-slate-700 mt-1 line-clamp-2">{event.tasks}</p>
                    </div>
                  )}

                  {/* Action Button Logic */}
                  <div className="mt-auto pt-2">
                    {isOrganizer ? (
                      isMyEvent ? (
                        <button onClick={() => onNavigate('dashboard')} className="w-full h-11 rounded-xl font-bold text-sm bg-white border-2 border-slate-100 text-slate-700 hover:border-primary-500 hover:text-primary-600 transition-colors">
                          ⚙️ Manage
                        </button>
                      ) : (
                        <div className="w-full h-11 flex items-center justify-center text-slate-400 text-sm font-medium bg-slate-50 rounded-xl border border-slate-100 italic">
                          View Only
                        </div>
                      )
                    ) : (
                      (() => {
                        // Check user status
                        const reg = registrations.find((r: Registration) => r.eventId === event.id);
                        const status = reg?.status;

                        if (status === 'confirmed') {
                          return (
                            <button
                              onClick={() => handleOpenDetails(event.id)}
                              className="w-full h-11 rounded-xl font-bold text-sm bg-green-100 text-green-700 hover:bg-green-200 shadow-sm flex items-center justify-center gap-2"
                            >
                              <span>✅ Approved</span>
                            </button>
                          );
                        }

                        if (status === 'pending') {
                          return (
                            <button
                              disabled
                              className="w-full h-11 rounded-xl font-bold text-sm bg-yellow-50 text-yellow-600 border border-yellow-100 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <span>⏳ Pending</span>
                            </button>
                          );
                        }

                        if (status === 'rejected') {
                          return (
                            <button
                              disabled
                              className="w-full h-12 rounded-xl font-bold text-sm bg-red-50 text-red-400 border border-red-100 cursor-not-allowed"
                            >
                              ❌ Application Rejected
                            </button>
                          );
                        }

                        return (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenDetails(event.id)}
                              className="flex-1 h-12 rounded-xl font-bold text-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleJoin(event.id)}
                              disabled={joiningId === event.id || isFull}
                              className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center ${isFull
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 text-white hover:bg-primary-600 shadow-lg'
                                }`}
                            >
                              {joiningId === event.id ? 'Sending...' : (isFull ? 'Full' : 'Join')}
                            </button>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
                );
          })}
              </div>
            )
          }

      {/* Details Modal */ }
            < EventDetailsModal
        isOpen = {!!selectedEventId}
          onClose={handleCloseDetails}
          event={selectedEventData}
      />
        </div>
      );
};
