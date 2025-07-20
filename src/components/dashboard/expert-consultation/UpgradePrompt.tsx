
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  packageType: string;
}

const UpgradePrompt = ({ packageType }: UpgradePromptProps) => {
  if (packageType === "enterprise") return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start">
        <div className="mr-3 mt-0.5 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-blue-800">Unlock More Expert Access</h4>
          <p className="text-sm text-blue-600 mt-1">
            Upgrade to {packageType === "starter" ? "Professional" : "Enterprise"} for access to our full team of specialists
            {packageType === "starter" ? " and extended consultation hours." : " and priority booking with unlimited sessions."}
          </p>
          <Button className="mt-3 bg-skilllink-green hover:bg-skilllink-dark-green">
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
