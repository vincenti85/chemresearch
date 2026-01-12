import axios from 'axios';

const FMP_BASE_URL = import.meta.env.VITE_FMP_BASE_URL || 'https://financialmodelingprep.com/api';
const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;

// Use proxy in development, direct API in production
const USE_PROXY = import.meta.env.DEV;
const API_BASE = USE_PROXY ? '/api/fmp' : FMP_BASE_URL;

/**
 * FMP API Client
 * Handles all requests to Financial Modeling Prep API
 */
class FMPApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = FMP_API_KEY || '';
    this.baseUrl = API_BASE;

    if (!this.apiKey) {
      console.warn('FMP API key not configured. Please set VITE_FMP_API_KEY in your .env file');
    }
  }

  /**
   * Generic GET request handler
   */
  private async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await axios.get<T>(url, {
        params: {
          ...params,
          apikey: this.apiKey,
        },
        headers: {
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        // Handle specific error cases
        if (status === 401 || status === 403) {
          throw new Error(`FMP API Authentication Error: ${message}. Please check your API key.`);
        } else if (status === 429) {
          throw new Error('FMP API Rate Limit Exceeded. Please wait and try again.');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('FMP API Request Timeout. Please try again.');
        } else if (!error.response) {
          throw new Error('FMP API Network Error. Please check your connection or CORS configuration.');
        } else {
          throw new Error(`FMP API Error (${status}): ${message}`);
        }
      }
      throw error;
    }
  }

  /**
   * Get stock quote
   * Example: getQuote('AAPL')
   */
  async getQuote(symbol: string) {
    return this.get(`/v3/quote/${symbol}`);
  }

  /**
   * Get company profile
   * Example: getProfile('AAPL')
   */
  async getProfile(symbol: string) {
    return this.get(`/v3/profile/${symbol}`);
  }

  /**
   * Get historical prices
   * Example: getHistoricalPrices('AAPL', { from: '2024-01-01', to: '2024-12-31' })
   */
  async getHistoricalPrices(symbol: string, params?: { from?: string; to?: string }) {
    return this.get(`/v3/historical-price-full/${symbol}`, params);
  }

  /**
   * Get income statement
   * Example: getIncomeStatement('AAPL', { period: 'annual', limit: 5 })
   */
  async getIncomeStatement(symbol: string, params?: { period?: 'annual' | 'quarter'; limit?: number }) {
    return this.get(`/v3/income-statement/${symbol}`, params);
  }

  /**
   * Get balance sheet
   * Example: getBalanceSheet('AAPL', { period: 'annual', limit: 5 })
   */
  async getBalanceSheet(symbol: string, params?: { period?: 'annual' | 'quarter'; limit?: number }) {
    return this.get(`/v3/balance-sheet-statement/${symbol}`, params);
  }

  /**
   * Get cash flow statement
   * Example: getCashFlow('AAPL', { period: 'annual', limit: 5 })
   */
  async getCashFlow(symbol: string, params?: { period?: 'annual' | 'quarter'; limit?: number }) {
    return this.get(`/v3/cash-flow-statement/${symbol}`, params);
  }

  /**
   * Search for symbols
   * Example: searchSymbols('Apple')
   */
  async searchSymbols(query: string, params?: { limit?: number; exchange?: string }) {
    return this.get(`/v3/search`, { query, ...params });
  }

  /**
   * Get market status
   */
  async getMarketStatus() {
    return this.get('/v3/is-the-market-open');
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.getMarketStatus();
      return {
        success: true,
        message: 'FMP API connection successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const fmpApi = new FMPApiClient();

// Export types
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export interface CompanyProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
}
