export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d?: { price: number[] };
  // Nuevas propiedades agregadas
  market_cap_rank?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  ath?: number;
  ath_change_percentage?: number;
  atl?: number;
  atl_change_percentage?: number;
  last_updated?: string;
}

export interface ApiResponse {
  data: CryptoCurrency[];
  loading: boolean;
  error: string | null;
}