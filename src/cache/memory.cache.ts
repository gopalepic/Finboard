type CacheEntry<T> = {
    data: T;
    expiresAt: number;
}

class MemoryCache {
    private store = new Map<string, CacheEntry<any>>();

    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) {
            return null;
        }

        if(Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }

        return entry.data;
    }

    set<T>(key: string, data: T , ttlMs:number) : void{
        this.store.set(key, {
            data,
            expiresAt: Date.now() + ttlMs
        });
    }
}

export const memoryCache = new MemoryCache();