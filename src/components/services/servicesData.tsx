
import { 
  Globe, 
  BarChart, 
  Search, 
  Mail, 
  Share2, 
  ShoppingCart, 
  Edit3, 
  Camera,
  MessageCircle  // Added this import for the Consultation icon
} from 'lucide-react';
import { ServiceType } from './types';

const services: ServiceType[] = [
  {
    id: 'web-dev',
    title: 'Web Development',
    icon: <Globe className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3", // Programming/coding image
    description: 'Custom website design and development tailored to your specific business needs and goals.',
    details: [
      'Responsive Web Design',
      'E-commerce Development',
      'CMS Integration',
      'Web Application Development',
      'Landing Page Design',
      'Website Maintenance & Support'
    ]
  },
  {
    id: 'seo',
    title: 'Search Engine Optimization',
    icon: <Search className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3", // SEO/Analytics image
    description: 'Boost your website visibility and drive organic traffic with our comprehensive SEO services.',
    details: [
      'Keyword Research & Analysis',
      'On-Page & Off-Page SEO',
      'Technical SEO Audits',
      'Local SEO',
      'SEO Content Strategy',
      'Rank Tracking & Reporting'
    ]
  },
  {
    id: 'sm-marketing',
    title: 'Social Media Marketing',
    icon: <Share2 className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3", // Social media marketing image
    description: 'Engage with your audience and build your brand presence across all social media platforms.',
    details: [
      'Social Media Strategy',
      'Content Creation & Curation',
      'Community Management',
      'Social Media Advertising',
      'Influencer Marketing',
      'Performance Analytics'
    ]
  },
  {
    id: 'email-marketing',
    title: 'Email Marketing',
    icon: <Mail className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3", // Email marketing image
    description: 'Create targeted email campaigns that nurture leads and boost customer retention.',
    details: [
      'Email Campaign Strategy',
      'Newsletter Design',
      'Drip Campaign Automation',
      'A/B Testing',
      'List Management & Segmentation',
      'Performance Analysis'
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Reporting',
    icon: <BarChart className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3", // Analytics dashboard image
    description: 'Make data-driven decisions with comprehensive analytics and clear reporting.',
    details: [
      'Google Analytics Setup & Tracking',
      'Custom Dashboard Creation',
      'Conversion Tracking',
      'User Behavior Analysis',
      'Regular Performance Reports',
      'ROI Measurement'
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Solutions',
    icon: <ShoppingCart className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3", // E-commerce image
    description: 'Build robust online stores that drive sales and provide excellent customer experiences.',
    details: [
      'E-commerce Website Development',
      'Shopping Cart Integration',
      'Payment Gateway Setup',
      'Product Catalog Management',
      'Inventory Management System',
      'Order Processing Automation'
    ]
  },
  {
    id: 'content',
    title: 'Content Creation',
    icon: <Edit3 className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3", // Content creation image
    description: 'Engage your audience with compelling, SEO-friendly content that drives results.',
    details: [
      'Blog Writing & Management',
      'Copywriting for Websites',
      'Product Descriptions',
      'Whitepapers & Case Studies',
      'Email Copy',
      'Social Media Content'
    ]
  },
  {
    id: 'photo-video',
    title: 'Photo & Video Production',
    icon: <Camera className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3", // Photo/video production image
    description: 'Professional visual content to enhance your brand image and marketing campaigns.',
    details: [
      'Product Photography',
      'Brand Photoshoots',
      'Promotional Videos',
      'Video Editing',
      'Drone Photography',
      'Virtual Tours'
    ]
  },
  // New Consultation service added here
  {
    id: 'consultation',
    title: 'Expert Consultation',
    icon: <MessageCircle className="w-6 h-6" />,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3", // Consultation/meeting image
    description: 'Personalized strategic guidance to help you navigate your digital transformation journey.',
    details: [
      'Digital Strategy Planning',
      'Technology Stack Consultation',
      'Market Research & Analysis',
      'Business Growth Roadmapping',
      'Digital Transformation Advisory',
      'One-on-One Expert Sessions'
    ]
  }
];

export default services;
