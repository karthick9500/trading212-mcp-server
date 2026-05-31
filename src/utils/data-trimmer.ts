/**
 * Utility to prune JSON responses to minimize token usage for LLMs.
 * Removes redundant metadata, null values, and internal IDs that aren't contextually useful.
 */
export function pruneResponse<T>(data: T): any {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => pruneResponse(item));
  }

  if (typeof data === 'object') {
    const pruned: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Skip common redundant fields in Trading 212 API or internal metadata
      const skipFields = ['externalId', 'internalId', 'links', 'meta'];
      if (skipFields.includes(key)) continue;
      
      // Skip null or undefined
      if (value === null || value === undefined) continue;

      // Recursive prune
      const prunedValue = pruneResponse(value);
      
      // Only add if it's not an empty object/array (unless it's a number/boolean)
      if (typeof prunedValue === 'object' && Object.keys(prunedValue).length === 0) continue;
      
      pruned[key] = prunedValue;
    }
    return pruned;
  }

  return data;
}