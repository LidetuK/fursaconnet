import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SocialCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const connection_token = searchParams.get('connection_token');

  useEffect(() => {
    if (connection_token) {
      console.log('Connection token:', connection_token);
      // Here you can process the token (e.g., fetch the profile via your backend)
      // Redirect back to the dashboard
      router.push('/dashboard');
    }
  }, [connection_token, router]);

  return <div>Processing connection...</div>;
};

export default SocialCallback; 