
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface AuthTabSelectorProps {
  tab: "signin" | "signup";
  onTabChange: (tab: "signin" | "signup") => void;
  disabled?: boolean;
}

const AuthTabSelector: React.FC<AuthTabSelectorProps> = ({ tab, onTabChange, disabled }) => {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
      <Button
        variant={tab === "signin" ? "default" : "ghost"}
        onClick={() => onTabChange("signin")}
        disabled={disabled}
        className={`flex-1 rounded-lg font-medium transition-all ${
          tab === "signin" 
            ? "bg-white shadow-sm text-skilllink-green" 
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
      <Button
        variant={tab === "signup" ? "default" : "ghost"}
        onClick={() => onTabChange("signup")}
        disabled={disabled}
        className={`flex-1 rounded-lg font-medium transition-all ${
          tab === "signup" 
            ? "bg-white shadow-sm text-skilllink-green" 
            : "text-gray-600 hover:text-gray-800"
        }`}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Sign Up
      </Button>
    </div>
  );
};

export default AuthTabSelector;
