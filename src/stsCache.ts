import Bun from 'bun';
import { InstrumentedLRU } from '@/instrumentedCache';

// key = hash of player URL
const cacheSizeEnv = Bun.env.STS_CACHE_SIZE;
const maxCacheSize = cacheSizeEnv ? parseInt(cacheSizeEnv, 10) : 150;
export const stsCache = new InstrumentedLRU<string>('sts', maxCacheSize);
