
import { Expert } from '@/hooks/useExperts';

interface ExpertSelectorProps {
  experts: Expert[];
  selectedExpert: string | null;
  packageType: string;
  onSelectExpert: (expertId: string) => void;
}

const ExpertSelector = ({ experts, selectedExpert, packageType, onSelectExpert }: ExpertSelectorProps) => {
  return (
    <div>
      <h3 className="font-medium text-lg mb-4">1. Choose an Expert</h3>
      <div className="space-y-3">
        {experts.map((expert) => {
          const displayName = expert.full_name || 'Expert';
          const avatarUrl = expert.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
          
          return (
            <div 
              key={expert.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedExpert === expert.id 
                  ? 'border-skilllink-green bg-green-50' 
                  : 'border-gray-200 hover:border-skilllink-green'
              }`}
              onClick={() => onSelectExpert(expert.id)}
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium">{displayName}</h4>
                  <p className="text-sm text-skilllink-green">{expert.specialization}</p>
                  {expert.hourly_rate && (
                    <p className="text-xs text-gray-500">${expert.hourly_rate}/hour</p>
                  )}
                </div>
                {expert.availability_status === 'available' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
        
        {experts.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            No available experts found. Please check back later.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertSelector;
