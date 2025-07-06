import React from 'react';
import { CourseService } from '../../services/courseService';

interface ProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  size = 'md',
  color 
}) => {
  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : 'h-3';
  const progressColor = color || CourseService.getProgressColor(percentage);
  
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heightClass} overflow-hidden`}>
      <div
        className={`${heightClass} ${progressColor} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;