import { Suspense } from 'react';
import { CO2Dashboard } from '@components';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white">
      <header className="py-8 px-4 bg-black/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            CO2 Emissions Dashboard
          </h1>
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
