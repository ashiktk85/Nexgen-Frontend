import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-600"></div>
        {/* Inner pulsing dot */}
        <div className="absolute h-4 w-4 animate-pulse rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      </div>
      <p className="mt-6 animate-pulse text-sm font-medium tracking-widest text-blue-600">
        LOADING
      </p>
    </div>
  );
};

export default PageLoader;
