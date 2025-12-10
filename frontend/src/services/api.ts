import axios from 'axios';
import { Event, Registration, Badge, Feedback } from '../types';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to attach Clerk Token to requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// --- Event Services ---

export const getEvents = async (): Promise<Event[]> => {
  const response = await api.get('/events');
  return response.data;
};

export const getOrganizerEvents = async (organizerId: string): Promise<Event[]> => {
  const response = await api.get(`/events?organizerId=${organizerId}`);
  return response.data;
};

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const updateEventStatus = async (eventId: string, status: 'upcoming' | 'completed'): Promise<Event> => {
  const response = await api.patch(`/events/${eventId}`, { status });
  return response.data;
};

// Updated: Now accepts userName and userAvatar
export const joinEvent = async (eventId: string, userId: string, userName: string, userAvatar: string): Promise<Registration> => {
  const response = await api.post(`/events/${eventId}/join`, { userId, userName, userAvatar });
  return response.data;
};

// --- Registration/Volunteer Services ---

export const getEventRegistrations = async (eventId: string): Promise<Registration[]> => {
  const response = await api.get(`/events/${eventId}/registrations`);
  return response.data;
};

export const updateRegistrationStatus = async (registrationId: string, status: 'confirmed' | 'rejected'): Promise<Registration> => {
  const response = await api.patch(`/registrations/${registrationId}`, { status });
  return response.data;
};

export const getUserRegistrations = async (userId: string): Promise<Registration[]> => {
  const response = await api.get(`/users/${userId}/registrations`);
  return response.data;
};

export const getMyRegistrations = async (): Promise<Registration[]> => {
  const response = await api.get('/registrations/me');
  return response.data;
};

// --- Feedback & Statistics ---

export const getEventAverageRating = async (eventId: string): Promise<number> => {
  const response = await api.get(`/events/${eventId}/rating`);
  return response.data.average;
};

export const getFeedbacks = async (userId?: string, eventId?: string): Promise<any[]> => {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  if (eventId) params.append('eventId', eventId);
  
  const response = await api.get(`/feedbacks?${params.toString()}`);
  return response.data;
};

export const submitFeedback = async (data: { eventId: string; userId: string; rating: number; comment: string }): Promise<void> => {
  await api.post('/feedbacks', data);
};

export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  const response = await api.get(`/users/${userId}/badges`);
  return response.data;
};

// --- User/Auth Utils ---

export const getUserBookmarks = async (userId: string): Promise<string[]> => {
  const response = await api.get(`/users/${userId}/bookmarks`);
  return response.data;
};

export const toggleBookmark = async (userId: string, eventId: string): Promise<string[]> => {
  const response = await api.post(`/users/${userId}/bookmarks`, { eventId });
  return response.data;
};

export default api;