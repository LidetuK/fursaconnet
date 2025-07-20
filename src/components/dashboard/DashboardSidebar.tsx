import { useState } from 'react';
import { 
  BarChart3, 
  Code, 
  Search, 
  FileText, 
  Share2, 
  PenTool, 
  Users, 
  Target,
  Facebook,
  Building2,
  Menu, 
  X, 
  ChevronDown,
  ChevronRight,
  Play,
  Upload,
  Eye,
  Zap,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  services: {
    id: string;
    title: string;
    icon: React.ReactNode;
  }[];
  packageType: string;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const DashboardSidebar = ({ services, packageType, activeSection, onSectionChange }: SidebarProps) => {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [postsExpanded, setPostsExpanded] = useState(false);
  
  // Define the futuristic navigation structure
  const navigationItems = [
    {
      id: 'dashboard',
      title: 'Analytics Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      hasSubItems: false
    },
    {
      id: 'connect-social-media',
      title: 'Connect Social Media',
      icon: <Share2 className="w-5 h-5" />,
      hasSubItems: false
    },
    {
      id: 'posts',
      title: 'Posts',
      icon: <FileText className="w-5 h-5" />,
      hasSubItems: true,
      subItems: [
        { id: 'posts', title: 'View Posts', icon: <Eye className="w-4 h-4" /> },
        { id: 'upload-videos', title: 'Upload Videos', icon: <Play className="w-4 h-4" /> },
        { id: 'upload-content', title: 'Upload Content', icon: <Upload className="w-4 h-4" /> }
      ]
    },
    {
      id: 'content',
      title: 'Content Creation',
      icon: <PenTool className="w-5 h-5" />,
      hasSubItems: false
    },
    {
      id: 'web-dev',
      title: 'Web Development',
      icon: <Code className="w-5 h-5" />,
      hasSubItems: false
    },
    {
      id: 'seo',
      title: 'SEO',
      icon: <Search className="w-5 h-5" />,
      hasSubItems: false
    },
    {
      id: 'consultation',
      title: 'Expert Consultation',
      icon: <Users className="w-5 h-5" />,
      hasSubItems: false
    },
    {
      id: 'google-ads',
      title: 'Google Ads',
      icon: <Target className="w-5 h-5" />,
      hasSubItems: false
    },
    {
      id: 'meta-ads',
      title: 'Meta Ads',
      icon: <Facebook className="w-5 h-5" />,
      hasSubItems: false
    },
    {
      id: 'google-business',
      title: 'Google Business',
      icon: <Building2 className="w-5 h-5" />,
      hasSubItems: false
    }
  ];
  
  const handleSectionClick = (sectionId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    onSectionChange(sectionId);
    if (window.innerWidth < 1024) {
      setMobileOpen(false);
    }
  };

  const handlePostsToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPostsExpanded(!postsExpanded);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed z-50 bottom-4 right-4 lg:hidden bg-primary text-primary-foreground p-3 rounded-full shadow-lg animate-neon-pulse"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-card/80 backdrop-blur-xl border-r border-border/50 transition-all duration-300 flex flex-col futuristic-grid",
          expanded ? "w-72" : "w-20",
          mobileOpen ? "fixed inset-y-0 left-0 z-40" : "hidden lg:flex"
        )}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--card))/90, hsl(var(--card))/70)',
          boxShadow: '0 0 50px hsl(var(--primary))/20, inset 0 0 50px hsl(var(--primary))/5'
        }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className={cn("flex items-center", !expanded && "hidden")}>
            <div className="relative">
              <img
                src="https://res.cloudinary.com/dkzw06zke/image/upload/v1748200742/skill_link_logo_hwmy6f.png"
                alt="SkillLink Logo"
                className="h-12 w-auto animate-glow"
              />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-all duration-300 lg:block hidden group"
          >
            <Menu size={20} className="group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {expanded && (
              <div className="mb-6">
                <h3 className="px-3 text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center">
                  <Zap className="w-3 h-3 mr-2" />
                  Dashboard
                </h3>
              </div>
            )}
            
            {navigationItems.map((item) => (
              <div key={item.id}>
                <div
                  className={cn(
                    "sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-xl cursor-pointer group",
                    activeSection === item.id && "active"
                  )}
                  onClick={(e) => {
                    if (item.id === 'posts') {
                      handlePostsToggle(e);
                    } else {
                      handleSectionClick(item.id, e);
                    }
                  }}
                >
                  <div className="mr-3 p-1 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {item.icon}
                  </div>
                  
                  {expanded && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.hasSubItems && (
                        <div className="ml-2 transition-transform duration-200">
                          {postsExpanded ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Sub items for Posts */}
                {item.id === 'posts' && postsExpanded && expanded && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
                    {item.subItems?.map((subItem) => (
                      <div
                        key={subItem.id}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/10 hover:text-primary",
                          activeSection === subItem.id && "bg-primary/10 text-primary"
                        )}
                        onClick={(e) => handleSectionClick(subItem.id, e)}
                      >
                        <div className="mr-3 opacity-70">
                          {subItem.icon}
                        </div>
                        <span>{subItem.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        
        {/* Sidebar footer */}
        <div className="p-4 border-t border-border/50">
          <div className={cn(
            "sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-xl cursor-pointer",
            activeSection === 'profile' && "active"
          )}
          onClick={(e) => handleSectionClick('profile', e)}
          >
            <div className="mr-3 p-1 rounded-lg bg-primary/10 text-primary">
              <Activity className="w-5 h-5" />
            </div>
            {expanded && <span>Your Profile</span>}
          </div>
          
          {expanded && (
            <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="text-xs text-primary font-semibold mb-1">Package: Enterprise</div>
              <div className="text-xs text-muted-foreground">All features unlocked</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;