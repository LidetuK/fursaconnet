
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loginUser, ping } from '@/lib/api';

const SignIn = () => {
  // Only show sign-in (no sign-up)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser, user } = useAuth();

  // If user is already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      console.log('User already logged in, redirecting...');
      if (user.is_admin) {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('=== FRONTEND LOGIN ATTEMPT START ===');
    console.log('Frontend login attempt:', { email, password: password ? '***provided***' : '***missing***' });
    console.log('Cookies before login:', document.cookie);
    
    try {
      // Use the loginUser function from api.ts
      console.log('Calling loginUser function...');
      const data = await loginUser({ email, password });
      console.log('Login successful, received data:', data);
      console.log('Cookies after login:', document.cookie);
      
      // Store token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('User data stored in localStorage');
      console.log('User data:', data.user);
      console.log('Is admin?', data.user.is_admin);
      
      // Test ping endpoint after login
      console.log('Testing ping endpoint after login...');
      try {
        const pingResult = await ping();
        console.log('Ping result after login:', pingResult);
      } catch (pingError) {
        console.error('Ping failed after login:', pingError);
      }
      
      // Refresh the auth context to update user state
      console.log('Refreshing auth context...');
      await refreshUser();
      
      console.log('About to redirect user:', data.user);
      if (data.user.is_admin) {
        console.log('Redirecting to admin dashboard...');
        navigate('/admin-dashboard', { replace: true });
      } else {
        console.log('Redirecting to dashboard...');
        navigate('/dashboard', { replace: true });
      }
    } catch (err: any) {
      console.error('=== FRONTEND LOGIN ERROR ===');
      console.error('Login failed with error:', err);
      console.error('Error message:', err.message);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
      console.log('=== FRONTEND LOGIN ATTEMPT END ===');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="https://res.cloudinary.com/dkzw06zke/image/upload/v1750003246/skill_link_premium_yjv3bn.png"
            alt="SkillLink Premium"
            className="h-12 w-auto"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 backdrop-blur-sm py-8 px-4 shadow-xl border border-white/20 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email or Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : null}
                Sign In
              </Button>
            </div>
            
            {error && <div className="text-center text-red-600 font-medium mt-2">{error}</div>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
