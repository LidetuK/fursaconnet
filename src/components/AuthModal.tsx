import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogIn, UserPlus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFacebookAuth } from "@/hooks/useFacebookAuth";
import { registerUser, loginUser } from '@/lib/api';

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackage?: string;
};

const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange, selectedPackage }) => {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loginWithFacebook, isLoading: fbLoading } = useFacebookAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === "signup") {
        await registerUser({ email, password, name: "user" });
        toast({
          title: "Sign up successful!",
          description: "Registration successful. You can now sign in.",
        });
        setTab("signin");
        setLoading(false);
        return;
      }
      const { user } = await loginUser({ email, password });
      toast({
        title: "Login successful!",
        description: `Welcome back, ${user?.email || email}!`,
      });
      onOpenChange(false);
      if (selectedPackage) {
        navigate("/payment", { state: { packageType: selectedPackage } });
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + 
            (selectedPackage ? `/payment?packageType=${encodeURIComponent(selectedPackage || "")}` : "/dashboard"),
        }
      });
      if (error) throw error;
      // The page will redirect if successful.
    } catch (error: any) {
      toast({
        title: "Google Sign In failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{tab === "signup" ? "Sign Up" : "Sign In"}</DialogTitle>
        <p id="auth-modal-desc" className="text-gray-600 mb-4">
          {tab === "signup" ? "Create a new account" : "Sign in to your account"}
        </p>
        <div className="flex justify-center gap-2 mb-8">
          <Button
            variant={tab === "signin" ? "default" : "ghost"}
            onClick={() => setTab("signin")}
            disabled={loading || fbLoading}
            className="flex-1"
          >
            <LogIn className="mr-2" size={16} />
            Sign In
          </Button>
          <Button
            variant={tab === "signup" ? "default" : "ghost"}
            onClick={() => setTab("signup")}
            disabled={loading || fbLoading}
            className="flex-1"
          >
            <UserPlus className="mr-2" size={16} />
            Sign Up
          </Button>
        </div>
        <form className="space-y-4" onSubmit={handleAuth} aria-describedby="auth-modal-desc">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            disabled={loading || fbLoading}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            disabled={loading || fbLoading}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={tab === "signin" ? "current-password" : "new-password"}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loading || fbLoading}
          >
            {loading ? <Loader2 className="animate-spin" /> : tab === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="my-4 flex items-center">
          <span className="flex-1 border-b" />
          <span className="mx-2 text-xs text-skilllink-dark-gray">OR</span>
          <span className="flex-1 border-b" />
        </div>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            disabled={loading || fbLoading}
            onClick={handleGoogleAuth}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 bg-[#1877F2] text-white hover:bg-[#166FE5]"
            disabled={loading || fbLoading}
            onClick={loginWithFacebook}
          >
            {fbLoading ? <Loader2 className="animate-spin" /> : 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7H17.3c-1.26,0-1.5.6-1.5,1.47v1.93h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z" />
              </svg>
            }
            Continue with Facebook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
