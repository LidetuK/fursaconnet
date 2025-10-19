
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SocialAuthButtonsProps {
  loading: boolean;
  fbLoading: boolean;
  onGoogleAuth: () => void;
  onFacebookAuth: () => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ 
  loading, 
  fbLoading, 
  onGoogleAuth, 
  onFacebookAuth 
}) => {
  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="h-12 border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm rounded-xl flex items-center gap-2 font-medium"
          disabled={loading || fbLoading}
          onClick={onGoogleAuth}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#4285F4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </Button>
        
        <Button
          variant="outline"
          className="h-12 bg-[#1877F2] text-white hover:bg-[#166FE5] border-0 rounded-xl flex items-center gap-2 font-medium"
          disabled={loading || fbLoading}
          onClick={onFacebookAuth}
        >
          {fbLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.9,2H3.1A1.1,1.1,0,0,0,2,3.1V20.9A1.1,1.1,0,0,0,3.1,22h9.58V14.25h-2.6v-3h2.6V9a3.64,3.64,0,0,1,3.88-4,20.26,20.26,0,0,1,2.33.12v2.7H17.3c-1.26,0-1.5.6-1.5,1.47v1.93h3l-.39,3H15.8V22h5.1A1.1,1.1,0,0,0,22,20.9V3.1A1.1,1.1,0,0,0,20.9,2Z" />
            </svg>
          }
          Facebook
        </Button>
      </div>
    </>
  );
};

export default SocialAuthButtons;
