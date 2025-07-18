import React from 'react';
import Image from 'next/image';
import { getStageStatus, STAGE_STATUSES } from '@/utils/stageStatusUtils';

// Inline CheckmarkIcon component with purple background
const CheckmarkIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className = '' 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Purple circle background */}
      <circle
        cx="12"
        cy="12"
        r="11"
        fill="#1c0076"
        stroke="#1c0076"
        strokeWidth="2"
      />
      
      {/* White checkmark */}
      <path
        d="M8 12L11 15L16 9"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

interface StatusIconProps {
  stageStatuses: any[];
  size?: number;
  className?: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ 
  stageStatuses, 
  size = 26, 
  className = '' 
}) => {
  const status = getStageStatus(stageStatuses);

  switch (status) {
    case STAGE_STATUSES.FINISHED:
      return <CheckmarkIcon size={size} className={className} />;
    
    case STAGE_STATUSES.IN_PROGRESS:
      return (
        <Image 
          src="/svg/pause.svg" 
          alt="In Progress" 
          width={size} 
          height={size}
          className={className}
        />
      );
    
    case STAGE_STATUSES.NEW:
    default:
      // Return empty div for new stages (no icon)
      return <div style={{ width: size, height: size }} className={className} />;
  }
};

export default StatusIcon; 