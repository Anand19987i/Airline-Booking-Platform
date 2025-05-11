import React from 'react';

const Spinner = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2 border-t-white',
    md: 'h-6 w-6 border-2 border-t-blue-600',
    lg: 'h-16 w-16 border-[3px]'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full 
          border-solid border-gray-200 
          border-t-black ${sizeClasses[size]}
          ${size === 'sm' ? 'border-t-[3px]' : 'border-t-2'}`}
        style={{ animationTimingFunction: 'linear' }}
      ></div>
    </div>
  );
};

export default Spinner;