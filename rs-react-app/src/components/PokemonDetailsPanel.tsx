import { useEffect, useState } from 'react';
import { fetchPokemonByName, type PokemonDetails } from '../api/pokeapi';
import Spinner from './Spinner';

interface PokemonDetailsPanelProps {
  detailsName: string;
  onClose: () => void;
}

const PokemonDetailsPanel = ({
  detailsName,
  onClose,
}: PokemonDetailsPanelProps) => {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPokemonByName(detailsName)
      .then((data) => {
        setDetails(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load details');
        setLoading(false);
      });
  }, [detailsName]);

  return (
    <div
      className="w-1/3 bg-white rounded-2xl shadow-lg p-6 flex flex-col relative min-h-[725px]"
      data-testid="details-panel"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 px-2 py-1 bg-red-200 rounded hover:bg-red-300 text-red-600"
      >
        ✕
      </button>
      {loading && <Spinner />}
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {details && !loading && !error && (
        <div className="flex flex-col items-center text-indigo-950">
          <img
            src={details.sprites.front_default}
            alt={details.name}
            className="w-32 h-32 mb-4"
          />
          <h2 className="text-2xl font-bold mb-2 text-indigo-950">
            {details.name}
          </h2>
          <p className="mb-2">
            Type: {details.types.map((t) => t.type.name).join(', ')}
          </p>
          <p className="mb-2">Height: {details.height}</p>
          <p className="mb-2">
            Abilities:{' '}
            {details.abilities?.map((a) => a.ability.name).join(', ')}
          </p>
          <p className="mb-2">
            Forms: {details.forms?.map((f) => f.name).join(', ')}
          </p>
          <div className="mb-2 max-h-32 w-full">
            <span className="font-semibold">Moves:</span>
            <ul className="list-disc list-inside text-sm ">
              {details.moves?.slice(0, 10).map((m) => (
                <li key={m.move.name} className="ml-6">
                  {m.move.name}
                </li>
              ))}
              {details.moves && details.moves.length > 10 && (
                <li className="ml-6">
                  ...and {details.moves.length - 10} more
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailsPanel;
