
import React from 'react';

interface FeatureExplanationProps {
  title: string;
  description: string;
  amharicDescription: string;
}

const FeatureExplanation = ({ 
  title, 
  description, 
  amharicDescription 
}: FeatureExplanationProps) => (
  <div className="bg-white border border-gray-200 rounded-md p-4 mb-4 shadow-sm">
    <h3 className="font-medium text-lg mb-2 text-skilllink-green">{title}</h3>
    <div className="space-y-2">
      <p className="text-gray-700">{description}</p>
      <div className="pt-2 border-t border-gray-100">
        <p className="text-gray-700 font-medium text-sm">በአማርኛ:</p>
        <p className="text-gray-700 text-sm">{amharicDescription}</p>
      </div>
    </div>
  </div>
);

export default FeatureExplanation;
