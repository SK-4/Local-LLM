import React from 'react';
import { TalentDNA as TalentDNAType, DNASegment } from '../types';

interface TalentDNAProps {
  talentDNA: TalentDNAType;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

const TalentDNA: React.FC<TalentDNAProps> = ({ 
  talentDNA, 
  size = 'medium', 
  interactive = true 
}) => {
  const sizeClasses = {
    small: 'w-24 h-32',
    medium: 'w-32 h-48',
    large: 'w-48 h-64'
  };

  const renderHelix = () => {
    const helixPoints = [];
    const segments = talentDNA.segments;
    const totalHeight = 180;
    const amplitude = 25;
    const frequency = 3;

    for (let i = 0; i < segments.length; i++) {
      const y = (i / (segments.length - 1)) * totalHeight;
      const leftX = 50 + amplitude * Math.sin(y * frequency * Math.PI / 180);
      const rightX = 50 - amplitude * Math.sin(y * frequency * Math.PI / 180);
      
      const segment = segments[i];
      const opacity = segment.unlocked ? 1 : 0.3;
      
      helixPoints.push(
        <g key={`segment-${i}`}>
          {/* Left strand */}
          <circle
            cx={leftX}
            cy={y + 20}
            r={segment.unlocked ? 4 : 2}
            fill={segment.color}
            opacity={opacity}
            className={interactive ? 'transition-all duration-300 hover:r-6' : ''}
          />
          {/* Right strand */}
          <circle
            cx={rightX}
            cy={y + 20}
            r={segment.unlocked ? 4 : 2}
            fill={segment.color}
            opacity={opacity}
            className={interactive ? 'transition-all duration-300 hover:r-6' : ''}
          />
          {/* Connecting line */}
          {segment.unlocked && (
            <line
              x1={leftX}
              y1={y + 20}
              x2={rightX}
              y2={y + 20}
              stroke={segment.color}
              strokeWidth={1.5}
              opacity={0.6}
            />
          )}
          {/* Progress indicator */}
          {segment.unlocked && (
            <circle
              cx={50}
              cy={y + 20}
              r={3}
              fill="none"
              stroke={segment.color}
              strokeWidth={1}
              strokeDasharray={`${segment.progress * 0.188} 18.84`}
              className="animate-spin"
              style={{ animationDuration: '3s' }}
            />
          )}
        </g>
      );
    }

    return helixPoints;
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      <svg
        width="100"
        height="200"
        viewBox="0 0 100 200"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="helixGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Background helix structure */}
        <path
          d="M 25 20 Q 50 10, 75 20 Q 50 30, 25 40 Q 50 50, 75 60 Q 50 70, 25 80 Q 50 90, 75 100 Q 50 110, 25 120 Q 50 130, 75 140 Q 50 150, 25 160 Q 50 170, 75 180"
          fill="none"
          stroke="url(#helixGradient)"
          strokeWidth={2}
          className="animate-pulse"
        />
        
        {renderHelix()}
      </svg>
      
      {/* Progress overlay */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <div className="text-xs font-medium text-gray-600">
          Level {talentDNA.level}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${talentDNA.completionPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {talentDNA.completionPercentage}% Complete
        </div>
      </div>
    </div>
  );
};

export default TalentDNA;