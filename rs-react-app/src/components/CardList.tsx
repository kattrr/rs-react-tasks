import Card from './Card';
import type { PokemonDetails } from '../api/pokeapi';

interface CardListProps {
  pokemons: PokemonDetails[];
  onCardClick?: (name: string) => void;
}

const CardList = ({ pokemons, onCardClick }: CardListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {pokemons.map((pokemon) => (
        <div key={pokemon.name} onClick={onCardClick ? () => onCardClick(pokemon.name) : undefined} className={onCardClick ? 'cursor-pointer' : ''}>
          <Card pokemon={pokemon} />
        </div>
      ))}
    </div>
  );
};

export default CardList;
