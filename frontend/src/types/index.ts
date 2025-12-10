export enum UserRole {
  VOLUNTEER = 'volunteer',
  ORGANIZER = 'organizer'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bookmarks?: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  maxVolunteers: number;
  currentVolunteers: number;
  description: string;
  organizerId: string;
  organizerName: string;
  imageUrl?: string;
  status: 'upcoming' | 'completed';
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'rejected';
  joinedAt: string;
  
  // Enriched fields for Dashboards
  eventTitle?: string;
  eventDate?: string;
  eventStatus?: string;
  hasFeedback?: boolean;
  
  // For Organizer Dashboard
  userName?: string;
  userAvatar?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

export interface Feedback {
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
}