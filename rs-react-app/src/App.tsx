import { Component } from 'react';
import { fetchPokemonList, fetchPokemonByName } from './api/pokeapi';
import SearchBar from './components/SearchBar';
import Card from './components/Card';

import type { PokemonDetails } from './api/pokeapi';

interface AppState {
  pokemon?: PokemonDetails;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      pokemon: undefined,
    };
  }
  componentDidMount(): void {
    fetchPokemonList(0, 10)
      .then((data) => {
        console.log('Lista de Pokémon:', data);
      })
      .catch((err) => {
        console.error('Error en lista:', err);
      });

    fetchPokemonByName('pikachu')
      .then((data) => {
        this.setState({ pokemon: data });
      })
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <h1>PokeAPI Test</h1>
        <div className="">
          <h2 className="">Pokémon Search</h2>
          <SearchBar onSearch={(term) => console.log('Buscar:', term)} />
        </div>
        <p>Abre la consola del navegador (F12) para ver los resultados</p>
        {this.state.pokemon && (
          <div className="mt-6">
            <Card pokemon={this.state.pokemon} />
          </div>
        )}
      </div>
    );
  }
}

export default App;