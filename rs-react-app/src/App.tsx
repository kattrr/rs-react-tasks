import { Component } from 'react';
import { fetchPokemonList, fetchPokemonByName } from './api/pokeapi';
import SearchBar from './components/SearchBar';

class App extends Component {
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
        console.log('Datos de Pikachu:', data);
      })
      .catch((err) => {
        console.error('Error al buscar Pikachu:', err);
      });
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
      </div>
    );
  }
}

export default App;