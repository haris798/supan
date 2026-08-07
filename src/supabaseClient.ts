import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://pcoyvfhcniscynjkndlw.supabase.co';
const DEFAULT_KEY = 'sb_publishable_4HYaHZhOIECG56Eccpe4sA_xj-Ecy9n';

const clientCache = new Map<string, SupabaseClient>();

export function getSupabaseClient(projectUrl?: string, anonKey?: string): SupabaseClient {
  const url = projectUrl?.trim() || DEFAULT_URL;
  const key = anonKey?.trim() || DEFAULT_KEY;
  
  const cacheKey = `${url}___${key}`;
  if (!clientCache.has(cacheKey)) {
    clientCache.set(cacheKey, createClient(url, key));
  }
  return clientCache.get(cacheKey)!;
}

export const supabase = getSupabaseClient();

