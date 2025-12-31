export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  short_description: string | null;
  image_url: string | null;
  date: string;
  time: string;
  location: string;
  address: string | null;
  price: number;
  category_id: string | null;
  organizer_id: string | null;
  max_attendees: number | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  organizer?: Profile;
}

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  status: string;
  created_at: string;
  event?: Event;
  user?: Profile;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  events?: Event[];
}