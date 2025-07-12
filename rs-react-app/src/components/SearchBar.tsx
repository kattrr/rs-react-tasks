import { Component } from 'react';
import type { ChangeEvent } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

interface SearchBarState {
  searchTerm: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);

    const savedTerm = localStorage.getItem('searchTerm') || '';

    this.state = {
      searchTerm: savedTerm,
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearch = () => {
    const trimmed = this.state.searchTerm.trim();
    localStorage.setItem('searchTerm', trimmed);
    this.props.onSearch(trimmed);
  };

  render() {
    return (
      <div className="flex w-full justify-between ">
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleChange}
          className="bg-white/10 py-2 pl-4 rounded-2xl flex-3/4 mr-4"
          placeholder="Search Pokémon..."
        />
        <button onClick={this.handleSearch} className="rounded-2xl flex-1/4">
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;
