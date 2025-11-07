import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import type { CryptoCurrency } from '../../types/crypto';

// Definir el tipo para el rango de tiempo
type TimeRange = '1h' | '24h' | '7d' | '30d' | '1y';

interface PriceChartProps {
  crypto: CryptoCurrency;
  timeRange?: TimeRange;
}

// Datos de ejemplo para el gráfico (en un proyecto real vendrían de la API)
const generateChartData = (basePrice: number, timeRange: TimeRange) => {
  const data = [];
  const points = timeRange === '1h' ? 24 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
  
  let currentPrice = basePrice;
  
  for (let i = points; i >= 0; i--) {
    // Simular variación de precio realista
    const variation = (Math.random() - 0.5) * basePrice * 0.02;
    currentPrice += variation;
    
    data.push({
      time: i === 0 ? 'Now' : `${i}`,
      price: Math.max(currentPrice, basePrice * 0.8), // Prevenir valores negativos
      volume: Math.random() * 1000000
    });
  }
  
  return data.reverse();
};

const PriceChart: React.FC<PriceChartProps> = ({ 
  crypto, 
  timeRange = '7d' 
}) => {
  const [selectedRange, setSelectedRange] = React.useState<TimeRange>(timeRange);
  
  // Definir los time ranges con el tipo correcto
  const timeRanges: { label: string; value: TimeRange }[] = [
    { label: '1H', value: '1h' },
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
  ];

  const chartData = generateChartData(crypto.current_price, selectedRange);
  
  const isPositive = crypto.price_change_percentage_24h > 0;
  const chartColor = isPositive ? '#10B981' : '#EF4444';

  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header del gráfico */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {crypto.name} Price Chart
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedRange.toUpperCase()} performance
          </p>
        </div>
        
        {/* Selector de rango de tiempo */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mt-2 sm:mt-0">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                selectedRange === range.value
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico principal */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151" 
              opacity={0.1}
            />
            <XAxis 
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={formatPrice}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {formatPrice(payload[0].value as number)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              fillOpacity={1}
              fill="url(#colorPrice)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${crypto.current_price.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">24h Change</p>
          <p className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {crypto.price_change_percentage_24h?.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">24h High</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${(crypto.current_price * 1.05).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">24h Low</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${(crypto.current_price * 0.95).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;