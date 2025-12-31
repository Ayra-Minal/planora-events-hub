import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event, Category } from '@/types';

interface UseEventsOptions {
  categoryId?: string;
  date?: string;
  location?: string;
  search?: string;
}

export function useEvents(options: UseEventsOptions = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      let query = supabase
        .from('events')
        .select(`
          *,
          category:categories(*),
          organizer:profiles(*)
        `)
        .order('date', { ascending: true });

      if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options.date) {
        query = query.eq('date', options.date);
      }

      if (options.location) {
        query = query.ilike('location', `%${options.location}%`);
      }

      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      const { data } = await query;

      if (data) {
        setEvents(data as Event[]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [options.categoryId, options.date, options.location, options.search]);

  return { events, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (data) {
        setCategories(data as Category[]);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}

export function useEvent(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await supabase
        .from('events')
        .select(`
          *,
          category:categories(*),
          organizer:profiles(*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (data) {
        setEvent(data as Event);
      }
      setLoading(false);
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  return { event, loading };
}