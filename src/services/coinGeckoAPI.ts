import type { CryptoCurrency } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchTopCryptos = async (): Promise<CryptoCurrency[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h,7d,30d,1y&locale=en`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching crypto data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const searchCryptos = async (query: string): Promise<CryptoCurrency[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${query}&order=market_cap_desc&per_page=10&page=1&sparkline=true`
    );
    
    if (!response.ok) {
      throw new Error('Error searching cryptos');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Search Error:', error);
    throw error;
  }
};

// Función adicional para obtener datos detallados de una criptomoneda específica
export const fetchCryptoDetail = async (id: string): Promise<CryptoCurrency> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=true&price_change_percentage=24h,7d,30d,1y&locale=en`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching crypto details');
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Detail API Error:', error);
    throw error;
  }
};