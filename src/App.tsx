import { Suspense, useState, useEffect } from 'react';
import { CO2Dashboard, YearChangeHighlight } from '@components';

function App() {
  const [isUpdating, setIsUpdating] = useState(false);

  // Listen for year change events from child components
  useEffect(() => {
    const handleYearChange = () => {
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 1500);
    };

    // Custom event listener for year changes
    window.addEventListener('yearChange', handleYearChange);
    return () => window.removeEventListener('yearChange', handleYearChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white">
      <header className="py-8 px-4 bg-black/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-4xl md:text-5xl font-bold">
              CO2 Emissions Dashboard
            </h1>
            <YearChangeHighlight isActive={isUpdating} size="small" />
          </div>
          <p className="text-xl opacity-90">
            Global CO2 emissions data by countries
          </p>
        </div>
      </header>
      <main className="px-4 py-8 max-w-7xl mx-auto">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64 text-xl bg-white/10 rounded-xl backdrop-blur-lg">
              Loading CO2 data...
            </div>
          }
        >
          <CO2Dashboard />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
