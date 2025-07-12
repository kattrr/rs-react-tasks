import { Component } from 'react';
import type { PokemonDetails } from '../api/pokeapi';

interface CardProps {
  pokemon: PokemonDetails;
}

class Card extends Component<CardProps> {
  render() {
    const { name, sprites, types } = this.props.pokemon;

    return (
      <div className="">
        <img
          src={sprites.front_default}
          alt={name}
          className=""
        />
        <h2 className="">{name}</h2>
        <p className="">
          {types.map((t) => t.type.name).join(', ')}
        </p>
      </div>
    );
  }
}

export default Card;