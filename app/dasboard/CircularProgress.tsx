import React from "react";

interface CircularProgressProps {
  value: number;
  max?: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value, max = 4000 }) => {
  // Normalize value between 0 and max
  const normalizedValue = Math.min(Math.max(value, 0), max);

  // Calculate percentage for stroke-dasharray
  const percentage = (normalizedValue / max) * 100;

  return (
    <div className="relative  flex items-center justify-center w-56 h-56">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        {/* Background Circle */}
        <circle
          className="text-slate-300"
          opacity={0.5}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          cx="18"
          cy="18"
          r="15.9155"
        />
        {/* Progress Circle */}
        <circle
          className="text-white transition-all duration-300"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          cx="18"
          cy="18"
          r="15.9155"
          strokeDasharray={`${percentage}, 100`}
        />
      </svg>
      {/* Percentage Text */}
      <div className="absolute text-md font-bold text-center">
        <span>{normalizedValue}</span> 
      </div>
    </div>
  );
};

export default CircularProgress;
