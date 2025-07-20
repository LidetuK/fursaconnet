import React from 'react';
import { ExpertRegistryForm } from '@/components/ExpertRegistryForm';

const ExpertRegistry = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Join Our Expert Network
              </span>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Expert Registry
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Skill Link is a forward-thinking platform that bridges the gap between talented 
              digital experts and small to medium-sized enterprises (SMEs) in need of innovative solutions.
            </p>
          </div>

          {/* Form Section */}
          <ExpertRegistryForm />
        </div>
      </div>
    </div>
  );
};

export default ExpertRegistry;