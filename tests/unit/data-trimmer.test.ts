import { pruneResponse } from '../../src/utils/data-trimmer.js';

describe('Data Trimmer Utility', () => {
  it('should remove internal metadata and links', () => {
    const raw = {
      ticker: 'AAPL',
      internalId: '12345',
      links: { self: '/api/v0/apple' },
      meta: { timestamp: 123456789 },
      price: 150
    };
    const expected = {
      ticker: 'AAPL',
      price: 150
    };
    expect(pruneResponse(raw)).toEqual(expected);
  });

  it('should remove null values', () => {
    const raw = {
      name: 'Apple',
      description: null,
      notes: undefined
    };
    const expected = {
      name: 'Apple'
    };
    expect(pruneResponse(raw)).toEqual(expected);
  });

  it('should recursively prune nested objects and arrays', () => {
    const raw = {
      portfolio: [
        { ticker: 'AAPL', internalId: 'id1', details: { note: null, sector: 'Tech' } },
        { ticker: 'MSFT', internalId: 'id2', details: { note: 'Good', sector: 'Tech' } }
      ]
    };
    const expected = {
      portfolio: [
        { ticker: 'AAPL', details: { sector: 'Tech' } },
        { ticker: 'MSFT', details: { note: 'Good', sector: 'Tech' } }
      ]
    };
    expect(pruneResponse(raw)).toEqual(expected);
  });

  it('should remove empty objects resulting from pruning', () => {
    const raw = {
      name: 'Test',
      meta: { internal: 'data' }
    };
    const expected = {
      name: 'Test'
    };
    expect(pruneResponse(raw)).toEqual(expected);
  });
});