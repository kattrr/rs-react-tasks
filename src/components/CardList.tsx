import { Card } from '@components';
import type { PokemonDetails } from '@api/pokeapi';

interface CardListProps {
  pokemons: PokemonDetails[];
  onCardClick?: (name: string) => void;
}

const CardList = ({ pokemons, onCardClick }: CardListProps) => {
  if (pokemons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No Pokemon found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {pokemons.map((pokemon, index) => (
        <div
          key={`${pokemon.name}-${index}`}
          onClick={onCardClick ? () => onCardClick(pokemon.name) : undefined}
          className={onCardClick ? 'cursor-pointer' : ''}
        >
          <Card pokemon={pokemon} />
        </div>
      ))}
    </div>
  );
};

export default CardList;
