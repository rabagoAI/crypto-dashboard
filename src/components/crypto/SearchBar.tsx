import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Barra de búsqueda */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <select
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All</option>
          <option value="gainers">Top Gainers</option>
          <option value="losers">Top Losers</option>
          <option value="volume">High Volume</option>
        </select>
        
        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;