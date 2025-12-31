import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '@/types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = format(new Date(event.date), 'MMM dd, yyyy');
  const formattedTime = event.time.slice(0, 5);

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="group overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-[16/9] overflow-hidden bg-muted">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-primary opacity-20" />
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          {event.category && (
            <Badge variant="secondary" className="text-xs">
              {event.category.name}
            </Badge>
          )}
          <h3 className="font-heading font-semibold text-lg text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.short_description || event.description.slice(0, 100)}
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
          {event.price > 0 && (
            <div className="pt-2 border-t border-border">
              <span className="font-semibold text-primary">₹{event.price}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}