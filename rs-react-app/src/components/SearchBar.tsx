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
      <div className="flex gap-2 p-4 bg-gray-100 rounded">
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleChange}
          className="border border-gray-300 p-2 rounded w-full"
          placeholder="Search Pokémon..."
        />
        <button
          onClick={this.handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;