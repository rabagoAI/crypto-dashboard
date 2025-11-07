import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Coins } from 'lucide-react';
import type { CryptoCurrency } from '../../types/crypto';

interface StatsOverviewProps {
  cryptos: CryptoCurrency[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ cryptos }) => {
  const totalMarketCap = cryptos.reduce((sum, crypto) => sum + crypto.market_cap, 0);
  const totalVolume = cryptos.reduce((sum, crypto) => sum + crypto.total_volume, 0);
  
  const gainers = cryptos.filter(crypto => crypto.price_change_percentage_24h > 0).length;
  const losers = cryptos.filter(crypto => crypto.price_change_percentage_24h < 0).length;

  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const stats = [
    {
      label: 'Total Market Cap',
      value: formatLargeNumber(totalMarketCap),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      label: 'Total Volume (24h)',
      value: formatLargeNumber(totalVolume),
      icon: Coins,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      label: 'Gainers (24h)',
      value: gainers.toString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      label: 'Losers (24h)',
      value: losers.toString(),
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <stat.icon size={24} className={stat.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;