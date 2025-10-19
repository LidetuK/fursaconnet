
import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Feature {
  title: string;
  description: string;
  benefits: string[];
  features: string[];
}

interface HeaderPopupProps {
  feature: Feature;
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const HeaderPopup = ({ feature, isOpen, onClose, position }: HeaderPopupProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div 
        className="fixed z-50 animate-scale-in"
        style={{
          left: Math.min(position.x, window.innerWidth - 400),
          top: Math.min(position.y + 10, window.innerHeight - 300),
        }}
      >
        <Card className="w-96 bg-white/95 backdrop-blur-xl border-2 border-emerald-100 shadow-2xl">
          <CardContent className="p-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* What You Get Section */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-emerald-600 mb-2 flex items-center">
                <ChevronRight className="w-4 h-4 mr-1" />
                What You Get
              </h4>
              <ul className="space-y-1">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Features Section */}
            <div>
              <h4 className="text-sm font-semibold text-emerald-600 mb-2 flex items-center">
                <ChevronRight className="w-4 h-4 mr-1" />
                Key Features
              </h4>
              <ul className="space-y-1">
                {feature.features.map((featureItem, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {featureItem}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-emerald-400/10 rounded-lg pointer-events-none" />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default HeaderPopup;
