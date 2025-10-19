import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleAdsCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    if (code) {
      fetch('https://premium-promospace-production.up.railway.app/auth/google-ads/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Handle success (e.g., show campaigns, redirect, etc.)
          console.log('Google Ads connected:', data);
          navigate('/dashboard');
        })
        .catch((err) => {
          // Handle error
          console.error('Google Ads OAuth error:', err);
        });
    }
  }, [location, navigate]);

  return <div>Connecting your Google Ads account...</div>;
} 