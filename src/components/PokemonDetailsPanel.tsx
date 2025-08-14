'use client';

import Image from 'next/image';
import { usePokemonDetails } from '@hooks/usePokemonQueries';
import { Spinner } from '@components';

interface PokemonDetailsPanelProps {
  detailsName: string;
  onClose: () => void;
}

const PokemonDetailsPanel = ({
  detailsName,
  onClose,
}: PokemonDetailsPanelProps) => {
  const {
    data: details,
    isLoading: loading,
    error,
  } = usePokemonDetails(detailsName);

  return (
    <div
      className="w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col relative min-h-[725px]"
      data-testid="details-panel"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 px-2 py-1 bg-red-200 rounded hover:bg-red-300 text-red-600"
        aria-label="Close panel"
      >
        ✕
      </button>

      {loading && (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Error Loading Pokémon
          </h3>
          <p className="text-red-500">{error.message}</p>
          <p className="text-gray-600 mt-2">
            Please try again or select a different Pokémon
          </p>
        </div>
      )}

      {details && !loading && !error && (
        <div className="flex flex-col items-center text-indigo-950">
          <Image
            src={details.sprites.front_default}
            alt={details.name}
            width={128}
            height={128}
            className="w-32 h-32 mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-indigo-950 capitalize">
            {details.name}
          </h2>
          <div className="w-full space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold mb-1">Type</h4>
              <p>{details.types.map((t) => t.type.name).join(', ')}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold mb-1">Height</h4>
              <p>{details.height / 10} m</p>
            </div>

            {details.abilities?.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-1">Abilities</h4>
                <p>{details.abilities.map((a) => a.ability.name).join(', ')}</p>
              </div>
            )}

            {details.moves?.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-semibold mb-2">Moves</h4>
                <ul className="grid grid-cols-2 gap-1 text-sm">
                  {details.moves.slice(0, 12).map((m) => (
                    <li key={m.move.name} className="capitalize">
                      {m.move.name.replace('-', ' ')}
                    </li>
                  ))}
                  {details.moves.length > 12 && (
                    <li className="text-gray-500">
                      +{details.moves.length - 12} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailsPanel;
