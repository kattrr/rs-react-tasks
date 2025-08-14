import React, { Suspense } from 'react';
import { fetchPokemonList, fetchPokemonByName } from '@/api/pokeapi';
import Spinner from '@/components/Spinner';
import ClientMainPage from '@/components/ClientMainPage';

export default async function HomePage() {
  // Fetch only 12 Pokemon initially (first page)
  const pokemonList = await fetchPokemonList(0, 12);

  // Fetch full details for each Pokemon
  const initialPokemonDetails = await Promise.all(
    pokemonList.map((pokemon) => fetchPokemonByName(pokemon.name))
  );

  return (
    <Suspense fallback={<Spinner />}>
      <ClientMainPage initialPokemonList={initialPokemonDetails} />
    </Suspense>
  );
}
