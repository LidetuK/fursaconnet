
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface UserTypeSelectorProps {
  userType: 'client' | 'digital_expert' | 'sme';
  onUserTypeChange: (value: 'client' | 'digital_expert' | 'sme') => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ userType, onUserTypeChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Choose your account type
      </label>
      <RadioGroup value={userType} onValueChange={onUserTypeChange}>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white/30 hover:bg-white/50 transition-colors">
            <RadioGroupItem value="sme" id="sme-modal" />
            <Label htmlFor="sme-modal" className="text-sm cursor-pointer">
              <span className="font-medium">SME</span> - I manage projects and assign tasks
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white/30 hover:bg-white/50 transition-colors">
            <RadioGroupItem value="digital_expert" id="expert-modal" />
            <Label htmlFor="expert-modal" className="text-sm cursor-pointer">
              <span className="font-medium">Digital Expert</span> - I provide marketing services
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeSelector;
