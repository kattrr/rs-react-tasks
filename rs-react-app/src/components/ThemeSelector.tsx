import { useTheme } from '../contexts/useTheme';
import { useEffect } from 'react';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium">Theme:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setTheme('light')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            theme === 'light'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Light
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Dark
        </button>
      </div>
    </div>
  );
};

export default ThemeSelector;
