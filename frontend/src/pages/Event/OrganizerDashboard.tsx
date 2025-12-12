// [file-path]: frontend/src/pages/Event/OrganizerDashboard.tsx

import React, { useEffect, useState } from 'react';
import { User, Event, Registration, Feedback } from '../../types';
import { supabase } from '../../services/supabaseClient';
import {
  createEvent, getOrganizerStats, updateEventStatus,
  getFeedbacks, getEventRegistrations, updateRegistrationStatus, updateEvent // Imported updateEvent
} from '../../services/api';

interface Props { user: User; }
interface Props { user: User; }
// We use the shared type now, but keep this alias if we want to extend locally later
import { EventWithStats } from '../../types';
import { EventFormModal } from './components/EventFormModal';
import { ParticipantsModal } from './components/ParticipantsModal';
import { ReviewsModal } from './components/ReviewsModal';
interface LocalEvent extends EventWithStats { }

export const OrganizerDashboard: React.FC<Props> = ({ user }) => {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [participantModal, setParticipantModal] = useState<{ isOpen: boolean, eventId: string, eventTitle: string } | null>(null);
  const [reviewsModal, setReviewsModal] = useState<{ isOpen: boolean, eventId: string, eventTitle: string } | null>(null); // NEW: Reviews Modal

  // Data States
  const [currentParticipants, setCurrentParticipants] = useState<Registration[]>([]);
  const [currentReviews, setCurrentReviews] = useState<Feedback[]>([]); // NEW: Reviews Data

  // Edit State
  const [editingEventId, setEditingEventId] = useState<string | null>(null); // NEW: Track if editing

  const [formData, setFormData] = useState({
    title: '', date: '', location: '', category: 'Campus Life',
    maxVolunteers: 20, description: '', tasks: '', imageUrl: ''
  });

  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    try {
      // OPTIMIZATION: Fetch events with pre-calculated stats (1 request vs N+1 requests)
      const data = await getOrganizerStats();
      setEvents(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchEvents(); }, [user.id]);

  // NEW: Fetch Reviews when Reviews Modal opens
  useEffect(() => {
    if (reviewsModal?.isOpen) {
      const loadReviews = async () => {
        const data = await getFeedbacks(undefined, reviewsModal.eventId);
        setCurrentReviews(data);
      };
      loadReviews();
    }
  }, [reviewsModal?.isOpen]);

  useEffect(() => {
    if (participantModal?.isOpen) {
      const fetchParticipants = async () => {
        const participants = await getEventRegistrations(participantModal.eventId);
        setCurrentParticipants(participants);
      };
      fetchParticipants();
    }
  }, [participantModal?.isOpen]);

  // NEW: Handle Edit Button Click
  const handleEditClick = (event: Event) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      category: event.category,
      maxVolunteers: event.maxVolunteers,
      description: event.description,
      tasks: event.tasks || '',
      imageUrl: event.imageUrl || ''
    });
    setShowModal(true);
  };

  // NEW: Reset form on modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEventId(null);
    setFormData({ title: '', date: '', location: '', category: 'Campus Life', maxVolunteers: 20, description: '', tasks: '', imageUrl: '' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-banners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-banners')
        .getPublicUrl(filePath);

      setFormData({ ...formData, imageUrl: data.publicUrl });

    } catch (error: any) {
      console.error(error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    try {
      if (editingEventId) {
        // Update Existing
        await updateEvent(editingEventId, { ...formData, organizerId: user.id, organizerName: user.name } as Event);
      } else {
        // Create New
        await createEvent({ ...formData, organizerId: user.id, organizerName: user.name });
      }
      handleCloseModal();
      fetchEvents();
    } catch (error) {
      console.error(error);
      alert("Failed to save event.");
    }
  };

  const handleConclude = async (eventId: string) => {
    if (confirm('Conclude event?')) {
      try {
        await updateEventStatus(eventId, 'completed');
        fetchEvents();
      } catch (error: any) {
        alert("Failed to conclude event");
      }
    }
  };

  const handleParticipantAction = async (registrationId: string, action: 'confirmed' | 'rejected', eventId: string) => {
    try {
      await updateRegistrationStatus(registrationId, action);
      const participants = await getEventRegistrations(eventId); // Refresh local list
      setCurrentParticipants(participants);
      fetchEvents();
    } catch (error: any) {
      alert("Action failed");
    }
  };

  const filteredEvents = events.filter(e => e.status === activeTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="text-2xl font-bold text-slate-900">Club Admin</h1><p className="text-slate-500 text-sm">{user.name}</p></div>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-700 shadow-lg shadow-primary-200 transition-transform hover:-translate-y-0.5">+ New Event</button>
      </div>

      <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-xl mb-6 w-fit">
        <button onClick={() => setActiveTab('upcoming')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Active</button>
        <button onClick={() => setActiveTab('completed')} className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>History</button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200"><p className="text-slate-400 text-sm font-medium">No events found.</p></div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2"><span className="text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded-md uppercase tracking-wider">{event.category}</span><span className="text-xs font-medium text-slate-400">{event.date}</span></div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{event.title}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">📍 {event.location}</p>
                {/* REVIEWS BUTTON */}
                {activeTab === 'completed' && (
                  <button
                    onClick={() => setReviewsModal({ isOpen: true, eventId: event.id, eventTitle: event.title })}
                    className="mt-4 flex items-center gap-4 bg-yellow-50 p-3 rounded-xl w-fit border border-yellow-100 hover:bg-yellow-100 transition-colors text-left"
                  >
                    <div className="flex items-center text-yellow-600 gap-1"><span className="text-xl font-bold">{event.avgRating || 0}</span><span>★</span></div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-yellow-800">View Reviews</span>
                      <span className="text-[10px] font-medium text-yellow-600">{event.feedbackCount} Student Reviews</span>
                    </div>
                  </button>
                )}
              </div>
              <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 border-t lg:border-t-0 border-slate-100 pt-4 lg:pt-0 justify-between lg:justify-center">
                <div className="flex items-center gap-6 bg-slate-50 px-5 py-3 rounded-xl"><div className="text-center lg:text-right"><div className="text-2xl font-bold text-slate-900 leading-none">{event.currentVolunteers}</div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Joined</div></div></div>
                {activeTab === 'upcoming' && (
                  <div className="flex flex-col gap-2 w-full lg:w-auto">
                    <button onClick={() => setParticipantModal({ isOpen: true, eventId: event.id, eventTitle: event.title })} className="w-full lg:w-40 h-10 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Manage Volunteers</button>
                    {/* EDIT BUTTON */}
                    <button onClick={() => handleEditClick(event)} className="w-full lg:w-40 h-10 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">Edit Details</button>
                    <button onClick={() => handleConclude(event.id)} className="w-full lg:w-40 h-10 text-xs font-bold text-primary-700 bg-primary-50 border border-primary-100 rounded-lg hover:bg-primary-100 transition-colors">Conclude Event</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <EventFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        onImageUpload={handleImageUpload}
        uploading={uploading}
        isEditing={!!editingEventId}
      />

      <ParticipantsModal
        isOpen={!!participantModal}
        onClose={() => setParticipantModal(null)}
        participants={currentParticipants}
        eventTitle={participantModal?.eventTitle || ''}
        eventId={participantModal?.eventId || ''}
        onAction={handleParticipantAction}
      />

      <ReviewsModal
        isOpen={!!reviewsModal}
        onClose={() => setReviewsModal(null)}
        reviews={currentReviews}
        eventTitle={reviewsModal?.eventTitle || ''}
      />

    </div>
  );
};