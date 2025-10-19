import React from 'react';

const clientId = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;
const redirectUri = import.meta.env.VITE_GOOGLE_ADS_REDIRECT_URI;
const developerToken = import.meta.env.VITE_GOOGLE_ADS_DEVELOPER_TOKEN;
const mccId = import.meta.env.VITE_GOOGLE_ADS_MCC_ID;

const SCOPE = 'https://www.googleapis.com/auth/adwords';
const RESPONSE_TYPE = 'code';
const ACCESS_TYPE = 'offline';
const PROMPT = 'consent';

export function GoogleAdsConnectButton() {
  const handleConnect = () => {
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(
      SCOPE
    )}&access_type=${ACCESS_TYPE}&prompt=${PROMPT}`;
    window.location.href = oauthUrl;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
      <div className="w-16 h-16 bg-[#f59e3e] rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Google Ads Account</h3>
      <p className="text-gray-600 mb-6">No Google Ads accounts found. Connect your account to get started.</p>
      
      <button 
        onClick={handleConnect} 
        className="w-full bg-[#f59e3e] hover:bg-[#e8913a] text-white font-medium py-3 px-4 rounded-lg mb-3 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        Connect Google Ads Account
      </button>
      
      <button className="w-full border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try Again
      </button>

      <div className="mt-6 text-left">
        <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• You'll be redirected to Google for authentication</li>
          <li>• Grant access to your Google Ads accounts</li>
          <li>• Return here to manage your campaigns</li>
        </ul>
      </div>
    </div>
  );
}

export default GoogleAdsConnectButton; 