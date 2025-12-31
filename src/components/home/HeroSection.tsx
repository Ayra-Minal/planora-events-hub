import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Search } from 'lucide-react';

export function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ask-ai?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative bg-gradient-hero py-20 lg:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI-Powered Event Discovery
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground animate-slide-up">
            Discover exciting{' '}
            <span className="text-gradient">events</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Join thousands of attendees exploring unique activities on Planora. Find tech meetups, music festivals, food carnivals, and more in Kochi.
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="relative max-w-xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="relative flex items-center bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ask Planora AI about events…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 pl-12 pr-28 py-6 border-0 bg-transparent focus-visible:ring-0 text-base"
              />
              <Button
                type="submit"
                className="absolute right-2 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Ask
              </Button>
            </div>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap justify-center gap-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {['Tech events this week', 'Music festivals', 'Food carnivals in Kochi'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  navigate(`/ask-ai?q=${encodeURIComponent(suggestion)}`);
                }}
                className="px-4 py-2 text-sm text-muted-foreground bg-muted hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}