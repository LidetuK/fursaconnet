
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock } from "lucide-react";
import UserTypeSelector from "./UserTypeSelector";

interface AuthFormProps {
  tab: "signin" | "signup";
  email: string;
  password: string;
  userType: 'client' | 'digital_expert' | 'sme';
  loading: boolean;
  fbLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onUserTypeChange: (userType: 'client' | 'digital_expert' | 'sme') => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  tab,
  email,
  password,
  userType,
  loading,
  fbLoading,
  onEmailChange,
  onPasswordChange,
  onUserTypeChange,
  onSubmit
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          disabled={loading || fbLoading}
          onChange={(e) => onEmailChange(e.target.value)}
          className="pl-10 h-12 border-gray-200 focus:border-skilllink-green focus:ring-skilllink-green rounded-xl bg-white/50"
          required
        />
      </div>
      
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          disabled={loading || fbLoading}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="pl-10 h-12 border-gray-200 focus:border-skilllink-green focus:ring-skilllink-green rounded-xl bg-white/50"
          required
        />
      </div>

      {tab === "signup" && (
        <UserTypeSelector 
          userType={userType}
          onUserTypeChange={onUserTypeChange}
        />
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-skilllink-green hover:bg-skilllink-dark-green text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        disabled={loading || fbLoading}
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        ) : null}
        {tab === "signin" ? "Sign In to Continue" : "Create My Account"}
      </Button>
    </form>
  );
};

export default AuthForm;
