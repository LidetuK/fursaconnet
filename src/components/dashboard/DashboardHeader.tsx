import { Bell, Search, User, LogOut, Zap, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  packageType: string;
}

const DashboardHeader = ({ packageType }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Convert package type to readable format
  const packageName = 
    packageType === 'starter' ? 'Starter' :
    packageType === 'professional' ? 'Professional' : 'Enterprise';

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <header 
      className="glass-card border-b border-border/50 sticky top-0 z-20 backdrop-blur-xl"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--card))/95, hsl(var(--card))/80)',
        boxShadow: '0 4px 32px hsl(var(--primary))/10'
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Status indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">System Online</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{packageName} Plan</span>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search dashboard..."
                className="w-64 pl-10 pr-4 py-2 text-sm bg-card/60 border border-border/50 rounded-xl 
                         placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 
                         focus:border-primary/50 backdrop-blur-sm transition-all duration-300"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-2 rounded-xl bg-card/60 border border-border/30 text-muted-foreground 
                             hover:text-primary hover:bg-primary/10 hover:border-primary/30 
                             focus:outline-none transition-all duration-300 group">
              <Bell className="h-5 w-5 group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
            </button>
            
            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 rounded-xl bg-card/60 border border-border/30 
                                 hover:bg-primary/10 hover:border-primary/30 focus:outline-none transition-all duration-300 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 
                                text-primary-foreground flex items-center justify-center shadow-lg 
                                group-hover:shadow-primary/30">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium">Dashboard</div>
                    <div className="text-xs text-muted-foreground">Active Session</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="glass-card border-border/50 shadow-2xl backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--card))/95, hsl(var(--card))/80)'
                }}
              >
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* System status indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;