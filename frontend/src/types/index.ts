/**
 * Shared Type Definitions.
 * Aligns with Backend Models (where applicable) and Frontend Interfaces.
 */

// ============================================================================
// DOMAIN: USERS & AUTH
// ============================================================================

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

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

// ============================================================================
// DOMAIN: EVENTS
// ============================================================================

export interface Event {
  id: string;
  title: string;
  date: string;       // ISO Date YYYY-MM-DD
  location: string;
  category: string;
  maxVolunteers: number;
  currentVolunteers: number;
  description: string;
  imageUrl?: string;  // Cloud storage URL
  tasks?: string;     // Newline separated list
  status: 'upcoming' | 'completed';

  // Organizer Info (flattened for convenience)
  organizerId: string;
  organizerName: string;
}

export interface EventWithStats extends Event {
  /** Aggregated star rating (1.0 - 5.0) from backend */
  avgRating: number;
  /** Total number of feedback submitted */
  feedbackCount: number;
}

// ============================================================================
// DOMAIN: INTERACTION (Join, Reviews)
// ============================================================================

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'rejected';
  joinedAt: string;

  // Flattened event details (Enriched by backend)
  eventTitle?: string;
  eventDate?: string;
  eventStatus?: string;

  // Flags
  hasFeedback?: boolean;

  // Organizer View: User details
  userName?: string;
  userAvatar?: string;
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
}
