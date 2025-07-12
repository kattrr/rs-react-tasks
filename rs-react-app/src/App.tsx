import { Component } from 'react';
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';
import { type PokemonDetails, fetchPokemonList, fetchPokemonByName } from './api/pokeapi';

interface AppState {
  pokemons: PokemonDetails[];
  loading: boolean;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      pokemons: [],
      loading: false,
    };
  }

  componentDidMount(): void {
    this.loadDefaultList();
  }

  loadDefaultList = async () => {
    this.setState({ loading: true });

    try {
      const list = await fetchPokemonList(0, 5); // obtén 5 pokemones
      const detailedList = await Promise.all(
        list.map((p) => fetchPokemonByName(p.name))
      );
      this.setState({ pokemons: detailedList, loading: false });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Pokémon Search</h1>
        <SearchBar onSearch={(term) => console.log('Buscar:', term)} />

        {this.state.loading && <p>Cargando...</p>}

        {!this.state.loading && (
          <CardList pokemons={this.state.pokemons} />
        )}
      </div>
    );
  }
}
export default App;