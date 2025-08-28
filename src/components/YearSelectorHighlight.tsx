import React from 'react';

interface YearSelectorHighlightProps {
  isActive: boolean;
  children: React.ReactNode;
  showProgress?: boolean;
}

const YearSelectorHighlight: React.FC<YearSelectorHighlightProps> = React.memo(
  ({ isActive, children, showProgress = false }) => {
    return (
      <div className="relative">
        {children}
        {isActive && (
          <>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="absolute inset-0 bg-yellow-400/10 rounded-lg animate-pulse"></div>
            {showProgress && (
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full animate-pulse"
                  style={{ width: '100%' }}
                ></div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
);

YearSelectorHighlight.displayName = 'YearSelectorHighlight';

export default YearSelectorHighlight;
