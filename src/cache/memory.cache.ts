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

        console.log(`store ` + JSON.stringify(this.store));

        return entry.data;
    }

    set<T>(key: string, data: T , ttlMs:number) : void{
        console.log(`Setting cache for ${key} with TTL ${ttlMs}ms`);
        this.store.set(key, {
            data,
            expiresAt: Date.now() + ttlMs
        });
        console.log(`store after set ` + JSON.stringify(this.store));
    }
}

export const memoryCache = new MemoryCache();