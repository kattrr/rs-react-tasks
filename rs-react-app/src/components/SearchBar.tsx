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
      <div className="">
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleChange}
          className=""
          placeholder="Search Pokémon..."
        />
        <button
          onClick={this.handleSearch}
          className=""
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;