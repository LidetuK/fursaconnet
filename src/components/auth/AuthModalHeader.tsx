
import React from "react";
import { DialogTitle } from "@/components/ui/dialog";

interface AuthModalHeaderProps {
  tab: "signin" | "signup";
}

const AuthModalHeader: React.FC<AuthModalHeaderProps> = ({ tab }) => {
  return (
    <div className="flex flex-col items-center text-center pt-6 pb-2">
      <div className="mb-4">
        <img
          src="https://res.cloudinary.com/dkzw06zke/image/upload/v1750003246/skill_link_premium_yjv3bn.png"
          alt="SkillLink Premium"
          className="h-10 w-auto"
        />
      </div>
      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        {tab === "signup" ? "Join SkillLink" : "Welcome Back"}
      </DialogTitle>
      <p className="text-gray-600 mt-2 text-sm">
        {tab === "signup" 
          ? "Start your digital marketing journey today" 
          : "Continue building your digital presence"}
      </p>
    </div>
  );
};

export default AuthModalHeader;
