import { Trading212Service } from '../../src/services/trading212.js';
import axios from 'axios';
import { jest } from '@jest/globals';

describe('Trading212Service', () => {
  let service: Trading212Service;
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      request: jest.fn()
    };
    jest.spyOn(axios, 'create').mockReturnValue(mockAxiosInstance as any);
    service = new Trading212Service('fake-key', 'demo');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch account info and prune response', async () => {
    const mockData = {
      accountId: '123',
      internalId: 'secret',
      currency: 'USD'
    };
    mockAxiosInstance.request.mockResolvedValue({ data: mockData });

    const result = await service.getAccountInfo();

    expect(result).toEqual({ accountId: '123', currency: 'USD' });
    expect(mockAxiosInstance.request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'equity/account/info',
      data: undefined
    });
  });

  it('should handle API errors gracefully', async () => {
    mockAxiosInstance.request.mockRejectedValue({
      response: { data: { errorMessage: 'Invalid Ticker' } }
    });

    await expect(service.getPosition('INVALID')).rejects.toThrow('Trading 212 API Error (equity/portfolio/INVALID): Invalid Ticker');
  });
});