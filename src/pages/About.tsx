import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Search, Calendar, Users, Brain, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Search',
    description: 'Find events using natural language. Just describe what you\'re looking for, and our AI will find the perfect match.',
  },
  {
    icon: Calendar,
    title: 'Smart Recommendations',
    description: 'Get personalized event suggestions based on your interests and past bookings.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Any user can create and share events, building a vibrant community of organizers and attendees.',
  },
  {
    icon: Globe,
    title: 'Local Focus',
    description: 'Discover events happening in and around Kochi, from tech meetups to cultural festivals.',
  },
];

const About = () => {
  return (
    <Layout>
      <div className="container py-12 lg:py-20 px-4">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            About Planora
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
            Discover Events the{' '}
            <span className="text-gradient">Smart Way</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Planora is an AI-powered event discovery platform that helps you find, explore, and book exciting events in Kochi and beyond. Whether you're looking for tech meetups, music festivals, food carnivals, or wellness workshops, we've got you covered.
          </p>
        </div>

        {/* Mission */}
        <Card className="max-w-3xl mx-auto mb-16">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe everyone should have easy access to local events and experiences. Our mission is to connect people with the activities they love, using cutting-edge AI technology to make event discovery as simple as having a conversation.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-10">
            AI-Powered Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-10">
            How It Works
          </h2>
          <div className="space-y-8">
            {[
              { step: '01', title: 'Search or Ask', description: 'Use our AI-powered search to find events. Type naturally like "Find music events this weekend" or browse by category.' },
              { step: '02', title: 'Explore', description: 'View event details, check organizer information, and see what\'s included. Every event page has all the info you need.' },
              { step: '03', title: 'Register', description: 'Found something you like? Register with one click. Your bookings are saved to your profile for easy access.' },
              { step: '04', title: 'Attend & Enjoy', description: 'Show up and have a great time! After the event, you can rate and review to help others discover great experiences.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="border-t border-border pt-12">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <div className="flex justify-center gap-8 text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <a href="mailto:contact@planora.app" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;