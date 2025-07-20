
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { registerUser, loginUser, registerSme } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { uploadLogoToSupabase } from '@/lib/uploadToSupabase';

type ModernAuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage?: string;
  initialTab?: "signin" | "signup";
};

const ModernAuthModal: React.FC<ModernAuthModalProps> = ({ 
  open, 
  onOpenChange, 
  selectedPackage,
  initialTab = "signin"
}) => {
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  // Only SME registration allowed
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        if (!companyName || !companyLogo) {
          toast({ title: 'All SME fields required', description: 'Please provide company name and logo.', variant: 'destructive' });
          setLoading(false);
          return;
        }
        // Upload logo to Supabase Storage
        let logoUrl = '';
        try {
          logoUrl = await uploadLogoToSupabase(companyLogo);
        } catch (uploadErr: any) {
          toast({ title: 'Logo upload failed', description: uploadErr.message, variant: 'destructive' });
          setLoading(false);
          return;
        }
        await registerSme({ email: email.trim(), company_name: companyName.trim(), password: password.trim(), company_logo: logoUrl });
        toast({ title: 'SME account created!', description: 'Registration successful. You can now sign in.' });
        setTab('signin');
        setLoading(false);
        return;
      }
      
      // Use the same login logic as SignIn.tsx
      console.log('Calling loginUser function from ModernAuthModal...');
      const data = await loginUser({ email: email.trim(), password: password.trim() });
      console.log('Login successful, received data:', data);
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Refresh the auth context to update user state
      await refreshUser();
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${data.user?.email || email}!`,
      });
      
      onOpenChange(false);
      
      // Redirect based on user type
      console.log('Redirecting user:', data.user);
      if (data.user.is_admin) {
        console.log('Redirecting to admin dashboard...');
        navigate('/admin-dashboard', { replace: true });
      } else {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      let errorMessage = error.message || "An error occurred during authentication";
      toast({
        title: tab === "signup" ? "Sign up failed" : "Sign in failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
        <DialogTitle>{tab === "signin" ? "Sign In" : "Sign Up"}</DialogTitle>
        <p id="auth-modal-desc" className="text-gray-600 mb-4">
          {tab === "signin" ? "Sign in to your account" : "Create a new account"}
        </p>
        {/* Tab Selector */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <Button
            variant={tab === "signin" ? "default" : "ghost"}
            onClick={() => setTab("signin")}
            disabled={loading}
            className={`flex-1 rounded-lg font-medium transition-all ${
              tab === "signin" 
                ? "bg-white shadow-sm text-emerald-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
          <Button
            variant={tab === "signup" ? "default" : "ghost"}
            onClick={() => setTab("signup")}
            disabled={loading}
            className={`flex-1 rounded-lg font-medium transition-all ${
              tab === "signup" 
                ? "bg-white shadow-sm text-emerald-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
        </div>

        <form className="space-y-4" onSubmit={handleAuth} aria-describedby="auth-modal-desc">
          {/* Company Name (SME only) */}
          {tab === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="company_name" className="text-sm font-medium text-gray-700">Company Name</label>
              <Input id="company_name" type="text" placeholder="Enter your company name" value={companyName} onChange={e => setCompanyName(e.target.value)} required disabled={loading} className="h-12" />
            </div>
          )}
          {/* Company Logo (SME only) */}
          {tab === 'signup' && (
            <div className="space-y-2">
              <label htmlFor="company_logo" className="text-sm font-medium text-gray-700">Company Logo (PNG, JPG, JPEG)</label>
              <Input id="company_logo" type="file" accept=".png,.jpg,.jpeg" onChange={e => {
                const file = e.target.files?.[0] || null;
                setCompanyLogo(file);
                if (file) setLogoPreview(URL.createObjectURL(file));
                else setLogoPreview(null);
              }} required disabled={loading} className="h-12" />
              {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-16 mt-2 rounded shadow" />}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-12"
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-12"
              autoComplete={tab === "signin" ? "current-password" : "new-password"}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : null}
            {tab === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModernAuthModal;
