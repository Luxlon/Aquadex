import React from "react";

interface CircularProgressProps {
  value: number;
  max?: number;
  label: string;
  unit: string;
  status: 'excellent' | 'good' | 'warning' | 'danger';
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
  value, 
  max = 100, 
  label, 
  unit, 
  status 
}) => {
  // Normalize value between 0 and max
  const normalizedValue = Math.min(Math.max(value, 0), max);
  
  // Calculate percentage for stroke-dasharray
  const percentage = (normalizedValue / max) * 100;

  // Get color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'excellent': return 'from-emerald-500 to-green-600';
      case 'good': return 'from-blue-500 to-cyan-600';
      case 'warning': return 'from-yellow-500 to-orange-600';
      case 'danger': return 'from-red-500 to-pink-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'warning': return 'Warning';
      case 'danger': return 'Danger';
      default: return 'Unknown';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
        {/* Background Circle */}
        <circle
          className="text-white/20"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          cx="18"
          cy="18"
          r="15.9155"
        />
        {/* Progress Circle */}
        <circle
          className={`${getStatusColor()} transition-all duration-500`}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          cx="18"
          cy="18"
          r="15.9155"
          strokeDasharray={`${percentage}, 100`}
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{normalizedValue.toFixed(1)}</span>
        <span className="text-xs text-white/70 uppercase tracking-wide">{unit}</span>
      </div>
      
      {/* Status Badge */}
      <div className="mt-4 flex flex-col items-center">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          status === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
          status === 'good' ? 'bg-blue-100 text-blue-800' :
          status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {getStatusText()}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;