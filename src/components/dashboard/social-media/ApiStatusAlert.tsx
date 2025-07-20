import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert } from "@/components/ui/alert";

interface ApiStatusAlertProps {
  status: boolean | null;
  apiName: string;
}

export const ApiStatusAlert = ({ status, apiName }: ApiStatusAlertProps) => {
  if (status === null) return null;
  
  return status ? (
    <Alert className="mb-4 p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
      <CheckCircle className="h-4 w-4 text-green-700 mr-2" />
      <div>
        <p className="font-medium">{apiName} API Configured Successfully</p>
        <p className="text-sm">Your {apiName} API credentials are valid. You can now connect and post to {apiName}.</p>
      </div>
    </Alert>
  ) : null;
};
