import React from 'react';

interface YearChangeHighlightProps {
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const YearChangeHighlight: React.FC<YearChangeHighlightProps> = React.memo(
  ({ isActive, size = 'medium', className = '' }) => {
    if (!isActive) return null;

    const sizeClasses = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-1 text-sm',
      large: 'px-4 py-3 text-base',
    };

    const baseClasses =
      'bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-300/10 border border-yellow-400/50 rounded-lg text-yellow-300 animate-pulse shadow-lg shadow-yellow-400/25';

    return (
      <div
        className={`flex items-center gap-2 ${sizeClasses[size]} ${baseClasses} ${className}`}
      >
        <span className="text-lg animate-spin">🔄</span>
        <span className="font-medium">
          {size === 'small' ? 'Updating' : 'Updating data...'}
        </span>

        {/* Animated dots */}
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"></div>
          <div
            className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    );
  }
);

YearChangeHighlight.displayName = 'YearChangeHighlight';

export default YearChangeHighlight;
