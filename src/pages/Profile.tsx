import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Booking, Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Plus, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          event:events(*, category:categories(*))
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (bookingsData) {
        setBookings(bookingsData as Booking[]);
      }

      // Fetch my events
      const { data: eventsData } = await supabase
        .from('events')
        .select(`*, category:categories(*)`)
        .eq('organizer_id', profile.id)
        .order('date', { ascending: false });

      if (eventsData) {
        setMyEvents(eventsData as Event[]);
      }

      setLoadingData(false);
    };

    if (profile) {
      fetchData();
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
        })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !profile) {
    return (
      <Layout>
        <div className="container py-8 px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 lg:py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-heading">Profile</CardTitle>
              {editing ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1 space-y-4">
                  {editing ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="text-lg font-medium">{profile.full_name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-lg font-medium">{user?.email}</p>
                      </div>
                      {profile.bio && (
                        <div>
                          <p className="text-sm text-muted-foreground">Bio</p>
                          <p className="text-muted-foreground">{profile.bio}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Events */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-heading">My Events</CardTitle>
              <Link to="/dashboard/create-event">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Create Event
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : myEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  You haven't created any events yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {myEvents.map((event) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(event.date), 'MMM dd, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          </div>
                        </div>
                        {event.category && (
                          <Badge variant="secondary">{event.category.name}</Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-heading">Booking History</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-lg" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  You haven't registered for any events yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Link
                      key={booking.id}
                      to={`/events/${booking.event_id}`}
                      className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{booking.event?.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {booking.event && format(new Date(booking.event.date), 'MMM dd, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {booking.event?.location}
                            </span>
                          </div>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;