'use client';

import Image from 'next/image';
import { type PokemonDetails } from '@api/pokeapi';
import { useSelectedItemsStore } from '@store/selectedItemsStore';

interface CardProps {
  pokemon: PokemonDetails;
}

const Card = ({ pokemon }: CardProps) => {
  const { name, sprites, types } = pokemon;
  const { addItem, removeItem, isSelected } = useSelectedItemsStore();
  const selected = isSelected(name);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.checked) {
      addItem(pokemon);
    } else {
      removeItem(name);
    }
  };

  return (
    <div className="bg-white rounded-3xl flex flex-col items-center p-4 shadow-md relative">
      <div className="absolute top-2 right-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={handleCheckboxChange}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      </div>
      <Image
        src={sprites.front_default}
        alt={name}
        width={96}
        height={96}
        className="w-24 h-24 object-contain mb-2"
      />
      <h2 className="text-black text-lg font-semibold">{name}</h2>
      <p className="text-black text-base">
        <b>type:</b> {types.map((t) => t.type.name).join(', ')}
      </p>
    </div>
  );
};

export default Card;
