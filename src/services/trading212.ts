import axios, { AxiosInstance } from 'axios';
import { pruneResponse } from '../utils/data-trimmer.js';

export type T212Environment = 'live' | 'demo';

export interface T212Credentials {
  apiKey: string;
  apiSecret: string;
  environment: T212Environment;
}

export class Trading212Service {
  private static getClient(creds: T212Credentials): AxiosInstance {
    const baseUrl = creds.environment === 'live' 
      ? 'https://live.trading212.com/api/v0/' 
      : 'https://demo.trading212.com/api/v0/';

    // Basic Auth: Basic <Base64(apiKey:apiSecret)>
    const authString = Buffer.from(`${creds.apiKey}:${creds.apiSecret}`).toString('base64');
    const authHeader = `Basic ${authString}`;

    return axios.create({
      baseURL: baseUrl,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });
  }

  private static async request(creds: T212Credentials, method: 'GET' | 'POST' | 'DELETE', url: string, data?: any) {
    try {
      const client = this.getClient(creds);
      const response = await client.request({
        method,
        url,
        data,
      });
      return pruneResponse(response.data);
    } catch (error: any) {
      console.error(`\n--- Trading 212 HTTP Error ---`);
      console.error(`Method: ${method}`);
      console.error(`URL: ${url}`);
      console.error(`Status: ${error.response?.status}`);
      console.error(`Status Text: ${error.response?.statusText}`);
      
      if (error.response?.data) {
        console.error(`Response Data:`, JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(`Error Message: ${error.message}`);
      }
      
      // Log sanitized headers for debugging
      const headers = error.config?.headers || {};
      const sanitizedHeaders = { ...headers };
      if (sanitizedHeaders['Authorization']) {
        sanitizedHeaders['Authorization'] = sanitizedHeaders['Authorization'].substring(0, 10) + '... (masked)';
      }
      console.error(`Request Headers:`, JSON.stringify(sanitizedHeaders, null, 2));
      console.error(`------------------------------\n`);

      const message = error.response?.data?.errorMessage || error.message;
      throw new Error(`Trading 212 API Error (${url}): ${message}`);
    }
  }

  // Account
  static async getAccountInfo(creds: T212Credentials) {
    return this.request(creds, 'GET', 'equity/account/info');
  }

  static async getAccountCash(creds: T212Credentials) {
    return this.request(creds, 'GET', 'equity/account/cash');
  }

  static async getAccountSummary(creds: T212Credentials) {
    return this.request(creds, 'GET', 'equity/account/summary');
  }

  // Instruments
  static async getExchangeInfo(creds: T212Credentials) {
    return this.request(creds, 'GET', 'equity/metadata/exchanges');
  }

  static async getAllInstruments(creds: T212Credentials) {
    return this.request(creds, 'GET', 'equity/metadata/instruments');
  }

  // Positions
  static async getAllPositions(creds: T212Credentials) {
    return this.request(creds, 'GET', 'equity/portfolio');
  }

  static async getPosition(creds: T212Credentials, ticker: string) {
    return this.request(creds, 'GET', `equity/portfolio/${ticker}`);
  }

  // Orders
  static async getAllOpenOrders(creds: T212Credentials) {
    return this.request(creds, 'GET', 'equity/orders');
  }

  static async getOrder(creds: T212Credentials, id: string) {
    return this.request(creds, 'GET', `equity/orders/${id}`);
  }

  static async placeMarketOrder(creds: T212Credentials, ticker: string, quantity: number) {
    return this.request(creds, 'POST', 'equity/orders/market', { ticker, quantity });
  }

  static async placeLimitOrder(creds: T212Credentials, ticker: string, quantity: number, limitPrice: number) {
    return this.request(creds, 'POST', 'equity/orders/limit', { ticker, quantity, limitPrice });
  }

  static async placeStopOrder(creds: T212Credentials, ticker: string, quantity: number, stopPrice: number) {
    return this.request(creds, 'POST', 'equity/orders/stop', { ticker, quantity, stopPrice });
  }

  static async placeStopLimitOrder(creds: T212Credentials, ticker: string, quantity: number, limitPrice: number, stopPrice: number) {
    return this.request(creds, 'POST', 'equity/orders/stoplimit', { ticker, quantity, limitPrice, stopPrice });
  }

  static async cancelOrder(creds: T212Credentials, id: string) {
    return this.request(creds, 'DELETE', `equity/orders/${id}`);
  }

  // History
  static async getHistoricalOrders(creds: T212Credentials, cursor?: string, limit: number = 20) {
    const url = cursor ? `history/orders?cursor=${cursor}&limit=${limit}` : `history/orders?limit=${limit}`;
    return this.request(creds, 'GET', url);
  }

  static async getHistoricalDividends(creds: T212Credentials, cursor?: string, limit: number = 20) {
    const url = cursor ? `history/dividends?cursor=${cursor}&limit=${limit}` : `history/dividends?limit=${limit}`;
    return this.request(creds, 'GET', url);
  }

  static async getHistoricalTransactions(creds: T212Credentials, cursor?: string, limit: number = 20) {
    const url = cursor ? `history/transactions?cursor=${cursor}&limit=${limit}` : `history/transactions?limit=${limit}`;
    return this.request(creds, 'GET', url);
  }
}