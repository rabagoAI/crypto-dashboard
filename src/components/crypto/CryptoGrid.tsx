import React from 'react';
import type { CryptoCurrency } from '../../types/crypto';
import CryptoCard from './CryptoCard';

interface CryptoGridProps {
  cryptos: CryptoCurrency[];
  onViewDetails: (crypto: CryptoCurrency) => void;
}

const CryptoGrid: React.FC<CryptoGridProps> = ({ cryptos, onViewDetails }) => {
  if (!cryptos || cryptos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No cryptocurrency data available
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cryptos.map((crypto) => (
        <CryptoCard 
          key={crypto.id} 
          crypto={crypto} 
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default CryptoGrid;