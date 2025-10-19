
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { registerUser, loginUser } from '@/lib/api';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<'client' | 'digital_expert' | 'sme'>('client');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await registerUser({ email, password, name: userType });
        toast({
          title: 'Success!',
          description: 'Registration successful. You can now sign in.',
        });
        setIsSignUp(false);
      } else {
        const { user } = await loginUser({ email, password });
        toast({
          title: 'Success!',
          description: 'Login successful.',
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignUp ? 'Create your account' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleAuth}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-skilllink-green focus:border-skilllink-green sm:text-sm"
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Account Type
                </label>
                <RadioGroup value={userType} onValueChange={(value: 'client' | 'digital_expert' | 'sme') => setUserType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client">Client - I need digital marketing services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="digital_expert" id="digital_expert" />
                    <Label htmlFor="digital_expert">Digital Expert - I provide digital marketing services</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sme" id="sme" />
                    <Label htmlFor="sme">SME - I manage projects and assign tasks</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full bg-skilllink-green hover:bg-skilllink-dark-green"
                disabled={loading}
              >
                {loading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                className="w-full max-w-xs flex items-center justify-center"
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g fill="none" fillRule="evenodd">
                    <path d="M20.66 12.7c0-.61-.05-1.19-.15-1.74H12.5v3.28h4.58a3.91 3.91 0 0 1-1.7 2.57v2.13h2.74a8.27 8.27 0 0 0 2.54-6.24z" fill="#4285F4" />
                    <path d="M12.5 21a8.1 8.1 0 0 0 5.63-2.06l-2.75-2.13a5.1 5.1 0 0 1-2.88.8 5.06 5.06 0 0 1-4.76-3.5H4.9v2.2A8.5 8.5 0 0 0 12.5 21z" fill="#34A853" />
                    <path d="M7.74 14.12a5.11 5.11 0 0 1 0-3.23v-2.2H4.9A8.5 8.5 0 0 0 4 12.5c0 1.37.33 2.67.9 3.82l2.84-2.2z" fill="#FBBC05" />
                    <path d="M12.5 7.38a4.6 4.6 0 0 1 3.25 1.27l2.44-2.44A8.17 8.17 0 0 0 12.5 4a8.5 8.5 0 0 0-7.6 4.68l2.84 2.2a5.06 5.06 0 0 1 4.76-3.5z" fill="#EA4335" />
                  </g>
                </svg>
                Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
