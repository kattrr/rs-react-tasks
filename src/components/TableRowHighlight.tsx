import React from 'react';

interface TableRowHighlightProps {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

const TableRowHighlight: React.FC<TableRowHighlightProps> = React.memo(
  ({ isActive, children, className = '' }) => {
    const highlightClasses = isActive
      ? 'animate-pulse bg-gradient-to-r from-yellow-500/20 via-yellow-400/15 to-yellow-300/10 border-l-4 border-l-yellow-400 shadow-lg shadow-yellow-400/25 scale-[1.01] transform-gpu'
      : '';

    return (
      <tr
        className={`${className} ${highlightClasses} transition-all duration-1000 ease-in-out hover:scale-[1.005]`}
      >
        {children}
        {isActive && (
          <td className="p-2 border-b border-white/10">
            <div className="w-8 h-1 bg-yellow-400/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full animate-pulse"
                style={{ width: '100%' }}
              ></div>
            </div>
          </td>
        )}
      </tr>
    );
  }
);

TableRowHighlight.displayName = 'TableRowHighlight';

export default TableRowHighlight;
