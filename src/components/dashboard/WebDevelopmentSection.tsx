
import { useState } from "react";
import WebsiteGenerator from "./web-development/WebsiteGenerator";

interface WebDevelopmentSectionProps {
  packageType: string;
}

const WebDevelopmentSection = ({ packageType }: WebDevelopmentSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Website Generator</h1>
          <p className="text-gray-500">Generate complete websites with AI - from concept to code</p>
        </div>
      </div>

      <WebsiteGenerator packageType={packageType} />
    </div>
  );
};

export default WebDevelopmentSection;
