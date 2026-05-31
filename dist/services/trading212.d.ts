export type T212Environment = 'live' | 'demo';
export interface T212Credentials {
    apiKey: string;
    apiSecret: string;
    environment: T212Environment;
}
export declare class Trading212Service {
    private static getClient;
    private static request;
    static getAccountInfo(creds: T212Credentials): Promise<any>;
    static getAccountCash(creds: T212Credentials): Promise<any>;
    static getAccountSummary(creds: T212Credentials): Promise<any>;
    static getExchangeInfo(creds: T212Credentials): Promise<any>;
    static getAllInstruments(creds: T212Credentials): Promise<any>;
    static getAllPositions(creds: T212Credentials): Promise<any>;
    static getPosition(creds: T212Credentials, ticker: string): Promise<any>;
    static getAllOpenOrders(creds: T212Credentials): Promise<any>;
    static getOrder(creds: T212Credentials, id: string): Promise<any>;
    static placeMarketOrder(creds: T212Credentials, ticker: string, quantity: number): Promise<any>;
    static placeLimitOrder(creds: T212Credentials, ticker: string, quantity: number, limitPrice: number): Promise<any>;
    static placeStopOrder(creds: T212Credentials, ticker: string, quantity: number, stopPrice: number): Promise<any>;
    static placeStopLimitOrder(creds: T212Credentials, ticker: string, quantity: number, limitPrice: number, stopPrice: number): Promise<any>;
    static cancelOrder(creds: T212Credentials, id: string): Promise<any>;
    static getHistoricalOrders(creds: T212Credentials, cursor?: string, limit?: number): Promise<any>;
    static getHistoricalDividends(creds: T212Credentials, cursor?: string, limit?: number): Promise<any>;
    static getHistoricalTransactions(creds: T212Credentials, cursor?: string, limit?: number): Promise<any>;
}
