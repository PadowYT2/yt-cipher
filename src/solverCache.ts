import Bun from 'bun';
import { InstrumentedLRU } from '@/instrumentedCache';
import { Solvers } from '@/types';

// key = hash of the player url
const cacheSizeEnv = Bun.env.SOLVER_CACHE_SIZE;
const maxCacheSize = cacheSizeEnv ? parseInt(cacheSizeEnv, 10) : 50;
export const solverCache = new InstrumentedLRU<Solvers>('solver', maxCacheSize);
