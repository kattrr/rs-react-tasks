import React, { Suspense } from 'react';
import { fetchPokemonList, fetchPokemonByName } from '@/api/pokeapi';
import Spinner from '@/components/Spinner';
import ClientMainPage from '@/components/ClientMainPage';

export default async function HomePage() {
  const pokemonList = await fetchPokemonList(0, 12);

  const initialPokemonDetails = await Promise.all(
    pokemonList.map((pokemon) => fetchPokemonByName(pokemon.name))
  );

  return (
    <Suspense fallback={<Spinner />}>
      <ClientMainPage initialPokemonList={initialPokemonDetails} />
    </Suspense>
  );
}
