import { LRUCache } from 'lru-cache';
import { cacheSize } from '@/metrics';

export class InstrumentedLRU<T extends {}> extends LRUCache<string, T> {
    constructor(
        private cacheName: string,
        max: number,
    ) {
        super({ max });
    }

    override set(key: string, value: T): this {
        super.set(key, value);
        cacheSize.labels({ cache_name: this.cacheName }).set(this.size);
        return this;
    }

    override delete(key: string): boolean {
        const deleted = super.delete(key);
        if (deleted) cacheSize.labels({ cache_name: this.cacheName }).set(this.size);
        return deleted;
    }
}
