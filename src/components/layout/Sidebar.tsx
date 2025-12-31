import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Calendar,
  MessageSquare,
  Info,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const publicNavItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/ask-ai', label: 'Ask AI', icon: MessageSquare },
  { path: '/about', label: 'About', icon: Info },
];

const authNavItems = [
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const NavLink = ({ path, label, icon: Icon }: { path: string; label: string; icon: React.ComponentType<{ className?: string }> }) => (
    <Link
      to={path}
      onClick={() => setMobileOpen(false)}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        isActive(path)
          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
          : 'text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-heading font-bold text-sidebar-foreground">Planora</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {publicNavItems.map((item) => (
          <NavLink key={item.path} {...item} />
        ))}

        {user && (
          <>
            <div className="my-4 border-t border-sidebar-border" />
            {authNavItems.map((item) => (
              <NavLink key={item.path} {...item} />
            ))}
          </>
        )}
      </nav>

      {/* Auth Section */}
      <div className="p-4 border-t border-sidebar-border">
        {user ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => {
              signOut();
              setMobileOpen(false);
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        ) : (
          <Link to="/auth" onClick={() => setMobileOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogIn className="h-5 w-5 mr-3" />
              Login / Register
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-heading font-bold text-sidebar-foreground">Planora</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-16 left-0 bottom-0 z-40 w-64 bg-sidebar transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-30">
        <SidebarContent />
      </aside>
    </>
  );
}