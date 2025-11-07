import { useState, useEffect, useMemo } from 'react';
import type { CryptoCurrency, ApiResponse } from '../types/crypto';
import { fetchTopCryptos } from '../services/coinGeckoAPI';

interface UseCryptoDataReturn extends ApiResponse {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
  filteredCryptos: CryptoCurrency[];
}

export const useCryptoData = (): UseCryptoDataReturn => {
  const [data, setData] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Filtrar y buscar criptomonedas
  const filteredCryptos = useMemo(() => {
    let result = data;

    // Búsqueda por nombre o símbolo
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(crypto =>
        crypto.name.toLowerCase().includes(query) ||
        crypto.symbol.toLowerCase().includes(query)
      );
    }

    // Aplicar filtros
    switch (filter) {
      case 'gainers':
        result = result
          .filter(crypto => crypto.price_change_percentage_24h > 0)
          .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        break;
      case 'losers':
        result = result
          .filter(crypto => crypto.price_change_percentage_24h < 0)
          .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        break;
      case 'volume':
        result = result.sort((a, b) => b.total_volume - a.total_volume);
        break;
      default:
        // Orden por market cap (default de la API)
        break;
    }

    return result;
  }, [data, searchQuery, filter]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const cryptoData = await fetchTopCryptos();
        setData(cryptoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Actualizar cada 2 minutos
    const interval = setInterval(loadData, 120000);
    
    return () => clearInterval(interval);
  }, []);

  return { 
    data, 
    loading, 
    error,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    filteredCryptos 
  };
};