import { Component } from 'react';
import { SearchBar, CardList, Spinner } from './components';
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

class App extends Component<object, AppState> {
  constructor(props: object) {
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
      const list = await fetchPokemonList(0, 12);
      const detailed = await Promise.all(
        list.map((p) => fetchPokemonByName(p.name))
      );
      this.setState({ pokemons: detailed, loading: false });
    } catch {
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
    } catch {
      this.setState({
        error: `No se encontró ningún Pokémon llamado "${term}"`,
        loading: false,
      });
    }
  };

  render() {
    const { pokemons, loading, error } = this.state;

    return (
      <div className="mx-auto">
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          🔍 Pokémon Search
        </h1>
        <SearchBar onSearch={this.handleSearch} />

        {loading && <Spinner />}

        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

        {!loading && !error && pokemons.length > 0 && (
          <CardList pokemons={pokemons} />
        )}
        <button
          onClick={() => {
            throw new Error('Prueba de error');
          }}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 outline-none border border-transparent hover:outline-red-400 hover:border-red-400 focus:outline-4 focus:outline-blue-400 transition-colors text-base font-medium"
        >
          Lanzar error
        </button>
      </div>
    );
  }
}

export default App;
