import Bun from 'bun';
import { InstrumentedLRU } from '@/instrumentedCache';

// The key is the hash of the player URL, and the value is the preprocessed script content.
const cacheSizeEnv = Bun.env.PREPROCESSED_CACHE_SIZE;
const maxCacheSize = cacheSizeEnv ? parseInt(cacheSizeEnv, 10) : 150;
export const preprocessedCache = new InstrumentedLRU<string>('preprocessed', maxCacheSize);
