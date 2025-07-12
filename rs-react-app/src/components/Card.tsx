import { Component } from 'react';
import type { PokemonDetails } from '../api/pokeapi';

interface CardProps {
  pokemon: PokemonDetails;
}

class Card extends Component<CardProps> {
  render() {
    const { name, sprites, types } = this.props.pokemon;

    return (
      <div className="bg-white rounded-4xl flex flex-col items-center p-4 shadow-md">
        <img
          src={sprites.front_default}
          alt={name}
          className=""
        />
        <h2 className="text-black">name: {name}</h2>
        <p className="text-black">type: {types.map((t) => t.type.name).join(', ')}</p>
      </div>
    );
  }
}

export default Card;