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
        const result = super.delete(key);
        cacheSize.labels({ cache_name: this.cacheName }).set(this.size);
        return result;
    }

    override clear(): void {
        super.clear();
        cacheSize.labels({ cache_name: this.cacheName }).set(this.size);
    }

    public remove(key: string): void {
        this.delete(key);
    }
}
