import { Component } from 'react';
import type { PokemonDetails } from '../api/pokeapi';

interface CardProps {
  pokemon: PokemonDetails;
}

class Card extends Component<CardProps> {
  render() {
    const { name, sprites, types } = this.props.pokemon;

    return (
      <div className="bg-white rounded-3xl flex flex-col items-center p-4 shadow-md">
        <img src={sprites.front_default} alt={name} className="w-24 h-24 object-contain mb-2" />
        <h2 className="text-black text-lg font-semibold">name: {name}</h2>
        <p className="text-black text-base">type: {types.map((t) => t.type.name).join(', ')}</p>
      </div>
    );
  }
}

export default Card;
