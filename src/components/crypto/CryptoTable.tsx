import React from 'react';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import type { CryptoCurrency } from '../../types/crypto';
import { useCryptoStore } from '../../stores/cryptoStore';

interface CryptoTableProps {
  cryptos: CryptoCurrency[];
}

const CryptoTable: React.FC<CryptoTableProps> = ({ cryptos }) => {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useCryptoStore();

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    });
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)}B`;
    }
    if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)}M`;
    }
    return `$${volume.toLocaleString()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                #
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                Coin
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                Price
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                24h Change
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                Market Cap
              </th>
              <th className="text-right py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                Volume (24h)
              </th>
              <th className="text-center py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                Favorite
              </th>
            </tr>
          </thead>
          <tbody>
            {cryptos.map((crypto, index) => {
              const isPositive = crypto.price_change_percentage_24h > 0;
              const isFav = isFavorite(crypto.id);

              return (
                <tr 
                  key={crypto.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {crypto.symbol.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {crypto.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${formatPrice(crypto.current_price)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className={`inline-flex items-center space-x-1 text-sm font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span>{crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right text-sm text-gray-900 dark:text-white">
                    {formatMarketCap(crypto.market_cap)}
                  </td>
                  <td className="py-4 px-6 text-right text-sm text-gray-500 dark:text-gray-400">
                    {formatVolume(crypto.total_volume)}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => isFav ? removeFavorite(crypto.id) : addFavorite(crypto.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Star 
                        size={18} 
                        className={isFav ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} 
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;