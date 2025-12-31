import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useEvent } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, MapPin, User, ArrowLeft, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading } = useEvent(id || '');
  const { user, profile } = useAuth();
  const [isBooked, setIsBooked] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const checkBooking = async () => {
      if (user && profile && id) {
        const { data } = await supabase
          .from('bookings')
          .select('id')
          .eq('user_id', profile.id)
          .eq('event_id', id)
          .maybeSingle();
        
        setIsBooked(!!data);
      }
    };
    checkBooking();
  }, [user, profile, id]);

  const handleBooking = async () => {
    if (!user || !profile) {
      toast.error('Please login to register for this event');
      return;
    }

    setBooking(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: profile.id,
          event_id: id,
        });

      if (error) throw error;

      setIsBooked(true);
      toast.success('Successfully registered for the event!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setBooking(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!profile) return;

    setBooking(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('user_id', profile.id)
        .eq('event_id', id);

      if (error) throw error;

      setIsBooked(false);
      toast.success('Booking cancelled successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-8 px-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="aspect-[21/9] rounded-xl mb-8" />
          <Skeleton className="h-10 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container py-8 px-4 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">Event not found</h1>
          <Link to="/events">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = format(new Date(event.date), 'EEEE, MMMM dd, yyyy');
  const formattedTime = event.time.slice(0, 5);

  return (
    <Layout>
      <div className="container py-8 px-4">
        {/* Back Button */}
        <Link to="/events" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Link>

        {/* Banner Image */}
        <div className="aspect-[21/9] rounded-xl overflow-hidden bg-muted mb-8">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary opacity-30" />
          )}
        </div>

        {/* Event Header */}
        <div className="mb-8">
          {event.category && (
            <Badge variant="secondary" className="mb-4">
              {event.category.name}
            </Badge>
          )}
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
            {event.title}
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-xl font-heading font-semibold mb-4">About this event</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-heading font-semibold mb-4">Organizer</h2>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{event.organizer.full_name || 'Event Organizer'}</p>
                      {event.organizer.bio && (
                        <p className="text-sm text-muted-foreground">{event.organizer.bio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <Card className="sticky top-8">
              <CardContent className="p-6 space-y-6">
                {/* Date & Time */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-sm text-muted-foreground">Date</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{formattedTime}</p>
                      <p className="text-sm text-muted-foreground">Time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                      {event.address && (
                        <p className="text-sm text-muted-foreground">{event.address}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-2xl font-bold text-primary">
                    {event.price > 0 ? `₹${event.price}` : 'Free'}
                  </p>
                </div>

                {/* Register Button */}
                {user ? (
                  isBooked ? (
                    <div className="space-y-3">
                      <Button className="w-full bg-success hover:bg-success/90" disabled>
                        <Ticket className="mr-2 h-4 w-4" />
                        Registered
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleCancelBooking}
                        disabled={booking}
                      >
                        Cancel Registration
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-gradient-primary hover:opacity-90"
                      onClick={handleBooking}
                      disabled={booking}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      {booking ? 'Registering...' : 'Register Now'}
                    </Button>
                  )
                ) : (
                  <Link to="/auth" className="block">
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      Login to Register
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;