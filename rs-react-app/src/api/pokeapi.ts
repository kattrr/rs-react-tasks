export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
  };
  types: { type: { name: string } }[];
}

export async function fetchPokemonList(
  offset = 0,
  limit = 20
): Promise<PokemonListItem[]> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Error fetching list: ${response.status}`);
  }

  const data = await response.json();
  return data.results; // Array de { name, url }
}

export async function fetchPokemonByName(
  name: string
): Promise<PokemonDetails> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (!response.ok) {
    throw new Error(`Pokémon "${name}" not found (${response.status})`);
  }

  const data = await response.json();
  return data;
}
