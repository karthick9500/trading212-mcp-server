export type T212Environment = 'live' | 'demo';
export declare class Trading212Service {
    private client;
    private baseUrl;
    constructor(apiKey: string, environment?: T212Environment);
    private request;
    getAccountInfo(): Promise<any>;
    getAccountCash(): Promise<any>;
    getExchangeInfo(): Promise<any>;
    getAllInstruments(): Promise<any>;
    getAllPositions(): Promise<any>;
    getPosition(ticker: string): Promise<any>;
    getAllOpenOrders(): Promise<any>;
    getOrder(id: string): Promise<any>;
    placeMarketOrder(ticker: string, quantity: number): Promise<any>;
    placeLimitOrder(ticker: string, quantity: number, limitPrice: number): Promise<any>;
    placeStopOrder(ticker: string, quantity: number, stopPrice: number): Promise<any>;
    placeStopLimitOrder(ticker: string, quantity: number, limitPrice: number, stopPrice: number): Promise<any>;
    cancelOrder(id: string): Promise<any>;
    getHistoricalOrders(cursor?: string, limit?: number): Promise<any>;
    getHistoricalDividends(cursor?: string, limit?: number): Promise<any>;
    getHistoricalTransactions(cursor?: string, limit?: number): Promise<any>;
}
