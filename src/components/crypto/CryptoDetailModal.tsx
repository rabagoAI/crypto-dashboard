import { X, Star, ExternalLink } from 'lucide-react';
import type { CryptoCurrency } from '../../types/crypto';
import { useCryptoStore } from '../../stores/cryptoStore';
import PriceChart from './PriceChart';

interface CryptoDetailModalProps {
  crypto: CryptoCurrency | null;
  isOpen: boolean;
  onClose: () => void;
}

const CryptoDetailModal: React.FC<CryptoDetailModalProps> = ({
  crypto,
  isOpen,
  onClose
}) => {
  // Removemos favorites ya que no se usa directamente
  const { addFavorite, removeFavorite, isFavorite } = useCryptoStore();

  if (!isOpen || !crypto) return null;

  const isPositive = crypto.price_change_percentage_24h > 0;
  const isFav = isFavorite(crypto.id);

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(crypto.id);
    } else {
      addFavorite(crypto.id);
    }
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  };

  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    return `$${(volume / 1e6).toFixed(2)}M`;
  };

  const formatSupply = (supply: number): string => {
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`;
    return supply.toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <img 
              src={crypto.image} 
              alt={crypto.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {crypto.name}
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {crypto.symbol.toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleFavoriteClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Star 
                size={24} 
                className={isFav ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} 
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Precio y cambio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${crypto.current_price.toLocaleString()}
                </span>
                <span className={`text-xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2)}%
                </span>
              </div>
              <PriceChart crypto={crypto} />
            </div>

            {/* Estadísticas rápidas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Statistics
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Market Cap</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatMarketCap(crypto.market_cap)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Volume (24h)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatVolume(crypto.total_volume)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Rank</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    #{crypto.market_cap_rank || 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {crypto.circulating_supply ? 
                      `${formatSupply(crypto.circulating_supply)} ${crypto.symbol.toUpperCase()}` : 'N/A'
                    }
                  </span>
                </div>

                {/* Información adicional opcional */}
                {crypto.total_supply && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Supply</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatSupply(crypto.total_supply)} {crypto.symbol.toUpperCase()}
                    </span>
                  </div>
                )}

                {crypto.max_supply && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Max Supply</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatSupply(crypto.max_supply)} {crypto.symbol.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <a 
                href={`https://www.coingecko.com/en/coins/${crypto.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <ExternalLink size={16} />
                <span>View on CoinGecko</span>
              </a>
            </div>
          </div>

          {/* Información de precios históricos si está disponible */}
          {(crypto.ath || crypto.atl) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {crypto.ath && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    All Time High
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${crypto.ath.toLocaleString()}
                    </span>
                    {crypto.ath_change_percentage && (
                      <span className={`text-sm ${crypto.ath_change_percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {crypto.ath_change_percentage > 0 ? '+' : ''}{crypto.ath_change_percentage.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {crypto.atl && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    All Time Low
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${crypto.atl.toLocaleString()}
                    </span>
                    {crypto.atl_change_percentage && (
                      <span className={`text-sm ${crypto.atl_change_percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {crypto.atl_change_percentage > 0 ? '+' : ''}{crypto.atl_change_percentage.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailModal;