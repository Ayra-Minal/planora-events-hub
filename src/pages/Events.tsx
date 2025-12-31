import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { EventGrid } from '@/components/events/EventGrid';
import { useEvents, useCategories } from '@/hooks/useEvents';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Events = () => {
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>();
  const [location, setLocation] = useState('');
  const [search, setSearch] = useState('');

  const { categories } = useCategories();
  const { events, loading } = useEvents({
    categoryId: categoryId || undefined,
    date: date ? format(date, 'yyyy-MM-dd') : undefined,
    location: location || undefined,
    search: search || undefined,
  });

  const clearFilters = () => {
    setCategoryId('');
    setDate(undefined);
    setLocation('');
    setSearch('');
  };

  const hasFilters = categoryId || date || location || search;

  return (
    <Layout>
      <div className="container py-8 lg:py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground">
            All Events
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse all events happening in and around Kochi
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-card rounded-xl border border-border">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category */}
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full lg:w-48 justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Location */}
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full lg:w-48"
          />

          {/* Clear Filters */}
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Events Grid */}
        <EventGrid
          events={events}
          loading={loading}
          emptyMessage="No events match your filters. Try adjusting your search criteria."
        />
      </div>
    </Layout>
  );
};

export default Events;