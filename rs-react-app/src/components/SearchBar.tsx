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
      <div className="flex w-full justify-between gap-4">
        <input
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleChange}
          className="bg-white/10 py-2 pl-4 rounded-2xl flex-grow mr-4 text-base text-black placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search Pokémon..."
        />
        <button
          onClick={this.handleSearch}
          className="rounded-lg border border-transparent px-[1.2em] py-[0.6em] text-base font-medium font-inherit bg-[#1a1a1a] text-white cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-4 focus:outline-blue-400"
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;
