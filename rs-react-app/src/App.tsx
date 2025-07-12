import { Component } from 'react';
import SearchBar from './components/SearchBar';
import CardList from './components/CardList';
import {
  fetchPokemonByName,
  fetchPokemonList,
  type PokemonDetails,
} from './api/pokeapi';

interface AppState {
  pokemons: PokemonDetails[];
  loading: boolean;
  error: string | null;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      pokemons: [],
      loading: false,
      error: null,
    };
  }

  componentDidMount(): void {
    const savedTerm = localStorage.getItem('searchTerm');

    if (savedTerm) {
      this.handleSearch(savedTerm);
    } else {
      this.loadDefaultList();
    }
  }

  loadDefaultList = async () => {
    this.setState({ loading: true, error: null });

    try {
      const list = await fetchPokemonList(0, 5); // carga 5 por defecto
      const detailed = await Promise.all(
        list.map((p) => fetchPokemonByName(p.name))
      );
      this.setState({ pokemons: detailed, loading: false });
    } catch (err) {
      this.setState({
        loading: false,
        error: 'Error al cargar los Pokémon por defecto',
      });
    }
  };

  handleSearch = async (term: string) => {
    if (!term) return;

    this.setState({ loading: true, error: null, pokemons: [] });

    try {
      const pokemon = await fetchPokemonByName(term.toLowerCase());
      this.setState({ pokemons: [pokemon], loading: false });
      localStorage.setItem('searchTerm', term);
    } catch (err) {
      this.setState({
        error: `No se encontró ningún Pokémon llamado "${term}"`,
        loading: false,
      });
    }
  };

  render() {
    const { pokemons, loading, error } = this.state;

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">🔍 Pokémon Search</h1>
        <SearchBar onSearch={this.handleSearch} />

        {loading && <p className="mt-4">Buscando...</p>}

        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

        {!loading && !error && pokemons.length > 0 && (
          <CardList pokemons={pokemons} />
        )}
        <button
          onClick={() => {
            throw new Error('Prueba de error');
          }}
          className=""
        >
          Lanzar error
        </button>
      </div>
    );
  }
}

export default App;