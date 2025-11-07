import React, { useState } from 'react';
import { Grid, Table } from 'lucide-react';
import Header from './components/layout/Header';
import CryptoGrid from './components/crypto/CryptoGrid';
import CryptoTable from './components/crypto/CryptoTable';
import CryptoDetailModal from './components/crypto/CryptoDetailModal';
import SearchBar from './components/crypto/SearchBar';
import StatsOverview from './components/crypto/StatsOverview';
import { useCryptoData } from './hooks/useCryptoData';
import LoadingSpinner from './components/ui/LoadingSpinner';
import type { CryptoCurrency } from './types/crypto';

type ViewMode = 'grid' | 'table';

function App() {
  const { 
    data, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    filter, 
    setFilter, 
    filteredCryptos 
  } = useCryptoData();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  const handleViewDetails = (crypto: CryptoCurrency) => {
    setSelectedCrypto(crypto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCrypto(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Estadísticas */}
        {!loading && !error && data.length > 0 && (
          <StatsOverview cryptos={data} />
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Top Cryptocurrencies
            {filteredCryptos.length > 0 && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredCryptos.length} coins)
              </span>
            )}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <Table size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <SearchBar 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {filteredCryptos.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No cryptocurrencies found for "{searchQuery}"
                </p>
              </div>
            )}
            
            {viewMode === 'grid' ? (
              <CryptoGrid 
                cryptos={filteredCryptos} 
                onViewDetails={handleViewDetails}
              />
            ) : (
              <CryptoTable cryptos={filteredCryptos} />
            )}
          </>
        )}

        {/* Modal de detalles */}
        <CryptoDetailModal
          crypto={selectedCrypto}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </main>
    </div>
  );
}

export default App;