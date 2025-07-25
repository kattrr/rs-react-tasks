import Card from './Card';
import type { PokemonDetails } from '../api/pokeapi';

interface CardListProps {
  pokemons: PokemonDetails[];
}

const CardList = ({ pokemons }: CardListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {pokemons.map((pokemon) => (
        <Card key={pokemon.name} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default CardList;
