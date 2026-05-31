/**
 * Utility to prune JSON responses to minimize token usage for LLMs.
 * Removes redundant metadata, null values, and internal IDs that aren't contextually useful.
 */
export declare function pruneResponse<T>(data: T): any;
