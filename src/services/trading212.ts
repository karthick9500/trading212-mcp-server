import axios, { AxiosInstance } from 'axios';
import { pruneResponse } from '../utils/data-trimmer.js';

export type T212Environment = 'live' | 'demo';

export class Trading212Service {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(apiKey: string, environment: T212Environment = 'demo') {
    this.baseUrl = environment === 'live' 
      ? 'https://live.trading212.com/api/v0/' 
      : 'https://demo.trading212.com/api/v0/';

    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  private async request(method: 'GET' | 'POST' | 'DELETE', url: string, data?: any) {
    try {
      const response = await this.client.request({
        method,
        url,
        data,
      });
      return pruneResponse(response.data);
    } catch (error: any) {
      const message = error.response?.data?.errorMessage || error.message;
      throw new Error(`Trading 212 API Error (${url}): ${message}`);
    }
  }

  // Account
  async getAccountInfo() {
    return this.request('GET', 'equity/account/info');
  }

  async getAccountCash() {
    return this.request('GET', 'equity/account/cash');
  }

  // Instruments
  async getExchangeInfo() {
    return this.request('GET', 'equity/metadata/exchanges');
  }

  async getAllInstruments() {
    return this.request('GET', 'equity/metadata/instruments');
  }

  // Positions
  async getAllPositions() {
    return this.request('GET', 'equity/portfolio');
  }

  async getPosition(ticker: string) {
    return this.request('GET', `equity/portfolio/${ticker}`);
  }

  // Orders
  async getAllOpenOrders() {
    return this.request('GET', 'equity/orders');
  }

  async getOrder(id: string) {
    return this.request('GET', `equity/orders/${id}`);
  }

  async placeMarketOrder(ticker: string, quantity: number) {
    return this.request('POST', 'equity/orders/market', { ticker, quantity });
  }

  async placeLimitOrder(ticker: string, quantity: number, limitPrice: number) {
    return this.request('POST', 'equity/orders/limit', { ticker, quantity, limitPrice });
  }

  async placeStopOrder(ticker: string, quantity: number, stopPrice: number) {
    return this.request('POST', 'equity/orders/stop', { ticker, quantity, stopPrice });
  }

  async placeStopLimitOrder(ticker: string, quantity: number, limitPrice: number, stopPrice: number) {
    return this.request('POST', 'equity/orders/stoplimit', { ticker, quantity, limitPrice, stopPrice });
  }

  async cancelOrder(id: string) {
    return this.request('DELETE', `equity/orders/${id}`);
  }

  // History
  async getHistoricalOrders(cursor?: string, limit: number = 20) {
    const url = cursor ? `history/orders?cursor=${cursor}&limit=${limit}` : `history/orders?limit=${limit}`;
    return this.request('GET', url);
  }

  async getHistoricalDividends(cursor?: string, limit: number = 20) {
    const url = cursor ? `history/dividends?cursor=${cursor}&limit=${limit}` : `history/dividends?limit=${limit}`;
    return this.request('GET', url);
  }

  async getHistoricalTransactions(cursor?: string, limit: number = 20) {
    const url = cursor ? `history/transactions?cursor=${cursor}&limit=${limit}` : `history/transactions?limit=${limit}`;
    return this.request('GET', url);
  }
}