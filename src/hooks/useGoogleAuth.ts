export const useGoogleAuth = () => {
  // Update this to your actual NestJS backend Google OAuth endpoint
  const backendUrl = "https://fursaconnet-production.up.railway.app/auth/google";

  const startGoogleLogin = () => {
    window.location.href = backendUrl;
  };

  return { startGoogleLogin };
};
