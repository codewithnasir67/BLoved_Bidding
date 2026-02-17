import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 via-transparent to-brand-teal/10 animate-pulse"></div>

      {/* Loader Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Spinning Ring */}
        <div className="relative w-24 h-24">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-brand-teal/20 rounded-full"></div>

          {/* Spinning Ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-brand-teal border-r-brand-teal rounded-full animate-spin"></div>

          {/* Inner Pulsing Circle */}
          <div className="absolute inset-3 bg-gradient-to-br from-brand-teal to-brand-teal-dark rounded-full animate-pulse"></div>
        </div>

        {/* Loading Text */}
        <div className="mt-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-teal to-brand-teal-dark bg-clip-text text-transparent mb-2">
            Loading
          </h2>

          {/* Animated Dots */}
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
