import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';
import { EventGrid } from '@/components/events/EventGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select(`
          *,
          category:categories(*),
          organizer:profiles(*)
        `)
        .order('date', { ascending: true })
        .limit(8);

      if (data) {
        setEvents(data as Event[]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-16 lg:py-24">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
              Featured Events
            </h2>
            <p className="mt-2 text-muted-foreground">
              Discover the best events happening in Kochi
            </p>
          </div>
          <Link to="/events">
            <Button variant="ghost" className="group">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <EventGrid events={events} loading={loading} />
      </div>
    </section>
  );
}