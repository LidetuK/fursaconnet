
import { 
  LayoutDashboard, 
  Globe, 
  Search, 
  Share2, 
  Mail, 
  Edit, 
  Camera, 
  Users,
  BarChart3,
  FileText,
  Send
} from 'lucide-react';

export const dashboardServices = [
  { id: 'dashboard', title: 'Analytics Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'web-dev', title: 'Web Development', icon: <Globe className="w-5 h-5" /> },
  { id: 'seo', title: 'SEO', icon: <Search className="w-5 h-5" /> },
  { id: 'social', title: 'Social Media Marketing', icon: <Share2 className="w-5 h-5" /> },
  { id: 'email', title: 'Email Marketing', icon: <Mail className="w-5 h-5" /> },
  { id: 'content', title: 'Content Creation', icon: <Edit className="w-5 h-5" /> },
  { id: 'photo-video', title: 'Photo & Video Production', icon: <Camera className="w-5 h-5" /> },
  { id: 'consultation', title: 'Expert Consultation', icon: <Users className="w-5 h-5" /> },
  { id: 'google-business', title: 'Google Business Performance', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'posts', title: 'Posts', icon: <FileText className="w-5 h-5" /> },
  { id: 'social-posts', title: 'Social Posts', icon: <Send className="w-5 h-5" /> },
];
