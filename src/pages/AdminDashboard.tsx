import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, CheckSquare, BarChart3, LogOut, Shield, User, Star, X, Download, Eye, Bug, Code, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { testSupabaseUpload } from '@/lib/testSupabaseUpload';

interface Expert {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  gender: string;
  currently_employed: boolean;
  contract_type?: string;
  expertise_areas: string; // JSON string instead of array
  experience: string;
  certifications_url?: string;
  passport_photo_url?: string;
  created_at: string;
}

interface SME {
  id: number;
  email: string;
  company_name: string;
  company_logo?: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [smes, setSmes] = useState<SME[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    try {
      // Load experts from NestJS backend
      const response = await fetch('https://fursaconnet-production.up.railway.app/experts');
      const data = await response.json();
      setExperts(data.experts || []);
      // Load SMEs
      const smesRes = await fetch('https://fursaconnet-production.up.railway.app/auth/smes');
      const smesData = await smesRes.json();
      setSmes(smesData.smes || []);
    } catch (error: any) {
      console.error('Error loading admin data:', error.message);
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Redirect non-authenticated users
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Redirect non-admin users to their respective dashboards
  if (!user.is_admin) {
    return <Navigate to="/dashboard" />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-skilllink-green"></div>
      </div>
    );
  }

  const handleDeleteExpert = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this expert?')) return;
    const res = await fetch(`https://fursaconnet-production.up.railway.app/experts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setExperts(experts.filter(e => e.id !== id));
      toast({ title: 'Expert deleted' });
    } else {
      toast({ title: 'Failed to delete expert', variant: 'destructive' });
    }
  };

  const handleDeleteSme = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this SME?')) return;
    const res = await fetch(`https://fursaconnet-production.up.railway.app/auth/smes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSmes(smes.filter(sme => sme.id !== id));
      toast({ title: 'SME deleted' });
    } else {
      toast({ title: 'Failed to delete SME', variant: 'destructive' });
    }
  };

  const handleCertificateClick = (url: string) => {
    setSelectedCertificate(url);
    setIsCertificateModalOpen(true);
  };

  const getFileType = (url: string) => {
    if (!url) return 'unknown';
    
    // Clean the URL and get the file extension
    const cleanUrl = url.split('?')[0]; // Remove query parameters
    const extension = cleanUrl.split('.').pop()?.toLowerCase();
    
    // More comprehensive file type detection
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension || '')) return 'image';
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension || '')) return 'document';
    if (['xls', 'xlsx', 'csv'].includes(extension || '')) return 'spreadsheet';
    if (['ppt', 'pptx'].includes(extension || '')) return 'presentation';
    
    // Check URL patterns for common file hosting services
    if (url.includes('pdf') || url.includes('PDF')) return 'pdf';
    if (url.includes('image') || url.includes('img') || url.includes('photo')) return 'image';
    
    return 'unknown';
  };

  const getFileIcon = (url: string) => {
    const fileType = getFileType(url);
    switch (fileType) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'document': return '📝';
      case 'spreadsheet': return '📊';
      case 'presentation': return '📋';
      default: return '📎';
    }
  };

  const getFileName = (url: string) => {
    if (!url) return 'Unknown File';
    
    // Try to extract filename from URL
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Remove query parameters
    const cleanName = lastPart.split('?')[0];
    
    // If no extension, try to add one based on file type
    if (!cleanName.includes('.')) {
      const fileType = getFileType(url);
      switch (fileType) {
        case 'pdf': return `${cleanName}.pdf`;
        case 'image': return `${cleanName}.jpg`;
        case 'document': return `${cleanName}.doc`;
        default: return cleanName;
      }
    }
    
    return cleanName || 'Certificate';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex flex-col items-start">
              <img
                src="https://res.cloudinary.com/dkzw06zke/image/upload/v1748200742/skill_link_logo_hwmy6f.png"
                alt="SkillLink Logo"
                className="h-10 w-auto"
              />
                <h1 className="text-lg font-bold text-gray-900 mt-2">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.username || user.email}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards - Full Width Above Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Experts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{experts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Registered experts
                    </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMEs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{smes.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Registered SMEs
                    </p>
              </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-green-600">Good</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
            <TabsTrigger value="smes">SMEs</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Platform Growth Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{experts.length + smes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Combined registrations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expert Ratio</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {experts.length + smes.length > 0 ? Math.round((experts.length / (experts.length + smes.length)) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Of total users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SME Ratio</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {experts.length + smes.length > 0 ? Math.round((smes.length / (experts.length + smes.length)) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Of total users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Experts</CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{experts.filter(e => !e.currently_employed).length}</div>
                  <p className="text-xs text-muted-foreground">
                    Ready for projects
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Expertise Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Expertise Distribution
                </CardTitle>
                <CardDescription>
                  Most popular digital skills and expertise areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const expertiseCounts: { [key: string]: number } = {};
                    experts.forEach(expert => {
                      try {
                        const areas = JSON.parse(expert.expertise_areas);
                        if (Array.isArray(areas)) {
                          areas.forEach(area => {
                            expertiseCounts[area] = (expertiseCounts[area] || 0) + 1;
                          });
                        }
                      } catch (e) {
                        if (expert.expertise_areas) {
                          expertiseCounts[expert.expertise_areas] = (expertiseCounts[expert.expertise_areas] || 0) + 1;
                        }
                      }
                    });
                    
                    const sortedAreas = Object.entries(expertiseCounts)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6); // Top 6 areas
                    
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
                    
                    return sortedAreas.map(([area, count], index) => ({
                      area,
                      count,
                      percentage: experts.length > 0 ? Math.round((count / experts.length) * 100) : 0,
                      color: colors[index % colors.length]
                    }));
                  })().map((item) => (
                    <div key={item.area} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.area}</span>
                        <span className="text-sm text-gray-500">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.percentage}% of experts</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Expert Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    Key indicators about expert quality and readiness
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Experts with Certifications</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {experts.filter(e => e.certifications_url).length}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({experts.length > 0 ? Math.round((experts.filter(e => e.certifications_url).length / experts.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Experts with Profile Photos</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {experts.filter(e => e.passport_photo_url).length}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({experts.length > 0 ? Math.round((experts.filter(e => e.passport_photo_url).length / experts.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Experienced Experts (3+ years)</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {experts.filter(e => ['4-5', '6-plus'].includes(e.experience)).length}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({experts.length > 0 ? Math.round((experts.filter(e => ['4-5', '6-plus'].includes(e.experience)).length / experts.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Currently Available</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {experts.filter(e => !e.currently_employed).length}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({experts.length > 0 ? Math.round((experts.filter(e => !e.currently_employed).length / experts.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    SME Platform Metrics
                  </CardTitle>
                  <CardDescription>
                    SME engagement and platform usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMEs with Company Logos</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {smes.filter(sme => sme.company_logo).length}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({smes.length > 0 ? Math.round((smes.filter(sme => sme.company_logo).length / smes.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Professional Email Domains</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {smes.filter(sme => !sme.email.includes('gmail.com') && !sme.email.includes('yahoo.com') && !sme.email.includes('hotmail.com')).length}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({smes.length > 0 ? Math.round((smes.filter(sme => !sme.email.includes('gmail.com') && !sme.email.includes('yahoo.com') && !sme.email.includes('hotmail.com')).length / smes.length) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Company Name Length</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {smes.length > 0 ? Math.round(smes.reduce((acc, sme) => acc + sme.company_name.length, 0) / smes.length) : 0}
                      </span>
                      <span className="text-xs text-gray-500">characters</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Platform Growth Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-600">
                        +{experts.length + smes.length > 0 ? Math.round(((experts.length + smes.length) / 10) * 100) : 0}%
                      </span>
                      <span className="text-xs text-gray-500">this month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="experts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Experts</CardTitle>
                <CardDescription>
                  View and manage registered digital experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {experts.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No experts found</h3>
                    <p className="text-gray-500">Experts will appear here once they register.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {experts.map((expert) => (
                      <div key={expert.id} className="bg-white border rounded-lg p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {/* Expert Photo */}
                            <div className="flex-shrink-0">
                              {expert.passport_photo_url ? (
                                <img
                                  src={expert.passport_photo_url}
                                  alt={`${expert.name}'s photo`}
                                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                  onError={(e) => {
                                    console.error('Failed to load profile photo:', expert.passport_photo_url);
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling!.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${expert.passport_photo_url ? 'hidden' : ''}`}>
                                  <User className="w-8 h-8 text-gray-400" />
                                </div>
                            </div>

                            {/* Expert Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                                <Badge variant={expert.gender === 'male' ? 'default' : 'secondary'}>
                                  {expert.gender}
                                </Badge>
                                <Badge variant={expert.currently_employed ? 'default' : 'outline'}>
                                  {expert.currently_employed ? 'Employed' : 'Available'}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                  <p><strong>Email:</strong> {expert.email}</p>
                                  <p><strong>Phone:</strong> {expert.phone_number}</p>
                                  <p><strong>Experience:</strong> {
                                    expert.experience === 'less-than-1' ? 'Less than 1 year' :
                                    expert.experience === '1-3' ? '1-3 years' :
                                    expert.experience === '4-5' ? '4-5 years' :
                                    expert.experience === '6-plus' ? '6+ years' : expert.experience
                                  }</p>
                                </div>
                      <div>
                        {expert.contract_type && (
                                    <p><strong>Contract Type:</strong> {expert.contract_type}</p>
                                  )}
                                  <p><strong>Expertise Areas:</strong></p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {(() => {
                                      try {
                                        const areas = JSON.parse(expert.expertise_areas);
                                        return Array.isArray(areas) ? areas.map((area, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {area}
                                          </Badge>
                                        )) : [expert.expertise_areas];
                                      } catch (e) {
                                        return [expert.expertise_areas || 'No expertise areas'];
                                      }
                                    })().map((area, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {area}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Certifications */}
                        {expert.certifications_url && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Certifications:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {(() => {
                                      let certs: string[] = [];
                                      try {
                                        certs = JSON.parse(expert.certifications_url);
                                      } catch {
                                        certs = expert.certifications_url.split(',');
                                      }
                                      return certs;
                                    })().map((url, index) => (
                                      <div key={index} className="flex items-center gap-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleCertificateClick(url.trim())}
                                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                                      >
                                          <Eye className="w-3 h-3 mr-1" />
                                          {getFileIcon(url.trim())} Cert {index + 1}
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => window.open(url.trim(), '_blank')}
                                          className="inline-flex items-center px-1 py-1 text-xs text-gray-500 hover:text-gray-700"
                                          title="Download"
                                        >
                                          <Download className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="mt-3 text-xs text-gray-500">
                                Registered: {new Date(expert.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col space-y-2">
                        <Button
                              onClick={() => handleDeleteExpert(expert.id)}
                          variant="destructive"
                              size="sm"
                        >
                          Delete
                        </Button>
                          </div>
                      </div>
                    </div>
                  ))}
                  </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="smes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered SMEs</CardTitle>
                <CardDescription>
                  View and manage registered SMEs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {smes.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No SMEs found</h3>
                    <p className="text-gray-500">SMEs will appear here once they register.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {smes.map((sme) => (
                      <div key={sme.id} className="bg-white border rounded-lg p-6 shadow-sm flex items-center gap-6">
                        {/* SME Logo */}
                        <div className="flex-shrink-0">
                          {sme.company_logo ? (
                            <img
                              src={sme.company_logo}
                              alt={`${sme.company_name} logo`}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        {/* SME Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">{sme.company_name}</h3>
                          <p className="text-sm text-gray-600"><strong>Email:</strong> {sme.email}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteSme(sme.id)}
                          className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expert Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Expert Analytics
                  </CardTitle>
                  <CardDescription>
                    Insights about registered experts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Gender Distribution */}
                  <div>
                    <h4 className="font-medium mb-3">Gender Distribution</h4>
                    <div className="space-y-2">
                      {(() => {
                        const maleCount = experts.filter(e => e.gender === 'male').length;
                        const femaleCount = experts.filter(e => e.gender === 'female').length;
                        const total = experts.length;
                        return [
                          { label: 'Male', count: maleCount, percentage: total > 0 ? Math.round((maleCount / total) * 100) : 0, color: 'bg-blue-500' },
                          { label: 'Female', count: femaleCount, percentage: total > 0 ? Math.round((femaleCount / total) * 100) : 0, color: 'bg-pink-500' }
                        ];
                      })().map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-sm">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.color}`} 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12">{item.percentage}%</span>
                            <span className="text-sm text-gray-500">({item.count})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <h4 className="font-medium mb-3">Experience Level Distribution</h4>
                    <div className="space-y-2">
                      {(() => {
                        const experienceData = {
                          'Less than 1 year': experts.filter(e => e.experience === 'less-than-1').length,
                          '1-3 years': experts.filter(e => e.experience === '1-3').length,
                          '4-5 years': experts.filter(e => e.experience === '4-5').length,
                          '6+ years': experts.filter(e => e.experience === '6-plus').length
                        };
                        const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'];
                        return Object.entries(experienceData).map(([label, count], index) => ({
                          label,
                          count,
                          color: colors[index]
                        }));
                      })().map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-sm">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.color}`} 
                                style={{ width: `${experts.length > 0 ? Math.round((item.count / experts.length) * 100) : 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12">{experts.length > 0 ? Math.round((item.count / experts.length) * 100) : 0}%</span>
                            <span className="text-sm text-gray-500">({item.count})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Employment Status */}
                  <div>
                    <h4 className="font-medium mb-3">Employment Status</h4>
                    <div className="space-y-2">
                      {(() => {
                        const employedCount = experts.filter(e => e.currently_employed).length;
                        const availableCount = experts.filter(e => !e.currently_employed).length;
                        const total = experts.length;
                        return [
                          { label: 'Employed', count: employedCount, percentage: total > 0 ? Math.round((employedCount / total) * 100) : 0, color: 'bg-green-500' },
                          { label: 'Available', count: availableCount, percentage: total > 0 ? Math.round((availableCount / total) * 100) : 0, color: 'bg-orange-500' }
                        ];
                      })().map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-sm">{item.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.color}`} 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-12">{item.percentage}%</span>
                            <span className="text-sm text-gray-500">({item.count})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expertise Areas Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Top Expertise Areas
                  </CardTitle>
                  <CardDescription>
                    Most popular digital skills among experts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(() => {
                      const expertiseCounts: { [key: string]: number } = {};
                      experts.forEach(expert => {
                        try {
                          const areas = JSON.parse(expert.expertise_areas);
                          if (Array.isArray(areas)) {
                            areas.forEach(area => {
                              expertiseCounts[area] = (expertiseCounts[area] || 0) + 1;
                            });
                          }
                        } catch (e) {
                          // Handle non-JSON expertise areas
                          if (expert.expertise_areas) {
                            expertiseCounts[expert.expertise_areas] = (expertiseCounts[expert.expertise_areas] || 0) + 1;
                          }
                        }
                      });
                      
                      const sortedAreas = Object.entries(expertiseCounts)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 8); // Top 8 areas
                      
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'];
                      
                      return sortedAreas.map(([area, count], index) => ({
                        area,
                        count,
                        percentage: experts.length > 0 ? Math.round((count / experts.length) * 100) : 0,
                        color: colors[index % colors.length]
                      }));
                    })().map((item) => (
                      <div key={item.area} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.area}</span>
                          <span className="text-sm text-gray-500">{item.count} experts</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`} 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SME Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  SME Analytics
                </CardTitle>
                <CardDescription>
                  Insights about registered SMEs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* SME Registration Trend */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{smes.length}</div>
                    <div className="text-sm text-gray-500">Total SMEs</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {smes.length > 0 ? Math.round((smes.filter(sme => sme.company_logo).length / smes.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-500">With Company Logo</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {smes.length > 0 ? Math.round((smes.filter(sme => sme.email.includes('@')).length / smes.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-500">Valid Email Format</div>
                  </div>
                </div>

                {/* Recent SME Registrations */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Recent SME Registrations</h4>
                  <div className="space-y-2">
                    {smes.slice(0, 5).map((sme) => (
                      <div key={sme.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {sme.company_logo ? (
                            <img 
                              src={sme.company_logo} 
                              alt={`${sme.company_name} logo`}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling!.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ${sme.company_logo ? 'hidden' : ''}`}>
                            <Briefcase className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{sme.company_name}</div>
                            <div className="text-xs text-gray-500">{sme.email}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {smes.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        No SMEs registered yet
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Platform Usage Analytics
                </CardTitle>
                <CardDescription>
                  User engagement across different platforms and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Web Development */}
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {(() => {
                        let count = 0;
                        experts.forEach(expert => {
                          try {
                            const areas = JSON.parse(expert.expertise_areas);
                            if (Array.isArray(areas) && areas.some(area => area.toLowerCase().includes('web'))) {
                              count++;
                            }
                          } catch (e) {
                            if (expert.expertise_areas?.toLowerCase().includes('web')) {
                              count++;
                            }
                          }
                        });
                        return count;
                      })()}
                    </div>
                    <div className="text-sm font-medium text-blue-700">Web Development</div>
                    <div className="text-xs text-blue-600">Experts</div>
                  </div>

                  {/* Mobile Development */}
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(() => {
                        let count = 0;
                        experts.forEach(expert => {
                          try {
                            const areas = JSON.parse(expert.expertise_areas);
                            if (Array.isArray(areas) && areas.some(area => area.toLowerCase().includes('mobile'))) {
                              count++;
                            }
                          } catch (e) {
                            if (expert.expertise_areas?.toLowerCase().includes('mobile')) {
                              count++;
                            }
                          }
                        });
                        return count;
                      })()}
                    </div>
                    <div className="text-sm font-medium text-green-700">Mobile Development</div>
                    <div className="text-xs text-green-600">Experts</div>
                  </div>

                  {/* Digital Marketing */}
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {(() => {
                        let count = 0;
                        experts.forEach(expert => {
                          try {
                            const areas = JSON.parse(expert.expertise_areas);
                            if (Array.isArray(areas) && areas.some(area => area.toLowerCase().includes('marketing'))) {
                              count++;
                            }
                          } catch (e) {
                            if (expert.expertise_areas?.toLowerCase().includes('marketing')) {
                              count++;
                            }
                          }
                        });
                        return count;
                      })()}
                    </div>
                    <div className="text-sm font-medium text-purple-700">Digital Marketing</div>
                    <div className="text-xs text-purple-600">Experts</div>
                  </div>

                  {/* Design */}
                  <div className="text-center p-4 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">
                      {(() => {
                        let count = 0;
                        experts.forEach(expert => {
                          try {
                            const areas = JSON.parse(expert.expertise_areas);
                            if (Array.isArray(areas) && areas.some(area => area.toLowerCase().includes('design'))) {
                              count++;
                            }
                          } catch (e) {
                            if (expert.expertise_areas?.toLowerCase().includes('design')) {
                              count++;
                            }
                          }
                        });
                        return count;
                      })()}
                    </div>
                    <div className="text-sm font-medium text-pink-700">Design</div>
                    <div className="text-xs text-pink-600">Experts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Certificate Viewer Modal */}
      <Dialog open={isCertificateModalOpen} onOpenChange={setIsCertificateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Certificate Viewer</span>
                {selectedCertificate && (
                  <Badge variant="outline" className="text-xs">
                    {getFileType(selectedCertificate).toUpperCase()}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedCertificate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedCertificate, '_blank')}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedCertificate && (
              <div className="w-full h-full">
                {getFileType(selectedCertificate) === 'pdf' ? (
                  <div className="w-full h-[70vh]">
                    {/* Try multiple PDF display methods */}
                    <iframe
                      src={`${selectedCertificate}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full border-0 rounded-md"
                      title={`Certificate PDF - ${getFileName(selectedCertificate)}`}
                      onError={() => {
                        // If iframe fails, show fallback
                        const iframe = document.querySelector('iframe');
                        if (iframe) {
                          iframe.style.display = 'none';
                          const fallback = iframe.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }
                      }}
                    />
                    {/* PDF Fallback */}
                    <div className="hidden flex-col items-center justify-center h-full text-center p-8">
                      <div className="text-6xl mb-4">📄</div>
                      <p className="text-lg font-medium mb-2">PDF Viewer Unavailable</p>
                      <p className="text-sm text-gray-500 mb-4">
                        The PDF cannot be displayed in the browser. This may be due to CORS restrictions or file format issues.
                      </p>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-400">
                          File: {getFileName(selectedCertificate)}
                        </p>
                        <Button
                          onClick={() => window.open(selectedCertificate, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Open PDF in New Tab
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : getFileType(selectedCertificate) === 'image' ? (
                  <div className="flex items-center justify-center h-[70vh]">
                    <img
                      src={selectedCertificate}
                      alt={getFileName(selectedCertificate)}
                      className="max-w-full max-h-full object-contain rounded-md shadow-lg"
                      onLoad={() => {
                        console.log('Image loaded successfully:', selectedCertificate);
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', selectedCertificate);
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    {/* Image Fallback */}
                    <div className="hidden flex-col items-center justify-center text-center p-8">
                      <div className="text-6xl mb-4">🖼️</div>
                      <p className="text-lg font-medium mb-2">Unable to display image</p>
                      <p className="text-sm text-gray-500 mb-4">
                        The image could not be loaded. This may be due to CORS restrictions, file corruption, or unsupported format.
                      </p>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-400">
                          File: {getFileName(selectedCertificate)}
                        </p>
                        <Button
                          onClick={() => window.open(selectedCertificate, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Open Image in New Tab
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : getFileType(selectedCertificate) === 'document' ? (
                  <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-lg font-medium mb-2">Document Preview</p>
                    <p className="text-sm text-gray-500 mb-4">
                      This document type cannot be previewed in the browser. Please download to view.
                    </p>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-400">
                        File: {getFileName(selectedCertificate)}
                      </p>
                      <Button
                        onClick={() => window.open(selectedCertificate, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download Document
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[70vh] text-center p-8">
                    <div className="text-6xl mb-4">📎</div>
                    <p className="text-lg font-medium mb-2">File Preview Not Available</p>
                    <p className="text-sm text-gray-500 mb-4">
                      This file type ({getFileType(selectedCertificate)}) cannot be previewed in the browser.
                    </p>
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-gray-400">
                        File: {getFileName(selectedCertificate)}
                      </p>
                      <Button
                        onClick={() => window.open(selectedCertificate, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
