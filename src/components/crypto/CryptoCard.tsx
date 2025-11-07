import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import type { CryptoCurrency } from '../../types/crypto';
import { useCryptoStore } from '../../stores/cryptoStore';

interface CryptoCardProps {
  crypto: CryptoCurrency;
  onViewDetails: (crypto: CryptoCurrency) => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onViewDetails }) => {
  // Removemos favorites ya que no se usa directamente
  const { addFavorite, removeFavorite, isFavorite } = useCryptoStore();
  
  const isPositive = crypto.price_change_percentage_24h > 0;
  const isFav = isFavorite(crypto.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(crypto.id);
    } else {
      addFavorite(crypto.id);
    }
  };

  const handleCardClick = () => {
    onViewDetails(crypto);
  };

  const formatPrice = (price: number): string => {
    if (price < 1) {
      return price.toFixed(4);
    }
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-all cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
    >
      {/* Header con nombre y favorito */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <img 
            src={crypto.image} 
            alt={crypto.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {crypto.symbol.toUpperCase()}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {crypto.name}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleFavoriteClick}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star 
            size={20} 
            className={isFav ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} 
          />
        </button>
      </div>

      {/* Precio */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ${formatPrice(crypto.current_price)}
        </div>
      </div>

      {/* Cambio 24h */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isPositive ? (
            <TrendingUp size={16} className="text-green-500" />
          ) : (
            <TrendingDown size={16} className="text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {crypto.price_change_percentage_24h?.toFixed(2) || '0.00'}%
          </span>
        </div>
        
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">Market Cap</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatMarketCap(crypto.market_cap)}
          </div>
        </div>
      </div>

      {/* Sparkline mini gráfico */}
      {crypto.sparkline_in_7d?.price && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            7D Trend
          </div>
          <div className="h-10 w-full">
            <Sparkline data={crypto.sparkline_in_7d.price} isPositive={isPositive} />
          </div>
        </div>
      )}
    </div>
  );
};

// Componente mini sparkline (se mantiene igual)
const Sparkline: React.FC<{ data: number[]; isPositive: boolean }> = ({ 
  data, 
  isPositive 
}) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const displayData = data.slice(-20);

  return (
    <svg
      viewBox={`0 0 ${displayData.length} 20`}
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <path
        d={displayData.map((value, index) => {
          const x = index;
          const y = 20 - ((value - min) / range) * 20;
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ')}
        stroke={isPositive ? '#10B981' : '#EF4444'}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CryptoCard;