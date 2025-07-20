import { Button } from '../ui/button';
import { FcGoogle } from 'react-icons/fc';

export const GoogleLoginButton = ({ onClick, loading }: { onClick: () => void, loading?: boolean }) => (
  <Button
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded shadow"
  >
    <FcGoogle size={24} />
    {loading ? 'Signing in...' : 'Sign in with Google'}
  </Button>
); 