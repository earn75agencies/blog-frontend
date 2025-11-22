/**
 * Frontend Cache Management Utility
 * Implements multi-level caching strategy
 */

/**
 * IndexedDB Cache Manager for large data
 */
class IndexedDBCache {
  dbName: string;
  version: number;
  db: IDBDatabase | null;

  constructor(dbName: string = 'gidi-blog', version: number = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;
        // Create object stores
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  async set(key: string, value: any, ttl: number = 3600000): Promise<boolean> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cache', 'metadata'], 'readwrite');
    const cacheStore = transaction.objectStore('cache');
    const metadataStore = transaction.objectStore('metadata');

    const expiresAt = Date.now() + ttl;

    return new Promise((resolve, reject) => {
      cacheStore.put({ key, value });
      metadataStore.put({
        key,
        createdAt: Date.now(),
        expiresAt,
        size: JSON.stringify(value).length,
      });

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async get(key: string): Promise<any> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cache', 'metadata'], 'readonly');
    const cacheStore = transaction.objectStore('cache');
    const metadataStore = transaction.objectStore('metadata');

    return new Promise((resolve, reject) => {
      const cacheRequest = cacheStore.get(key);
      const metadataRequest = metadataStore.get(key);

      transaction.oncomplete = () => {
        const metadata = (metadataRequest as any).result;

        if (!metadata || metadata.expiresAt < Date.now()) {
          this.delete(key);
          resolve(null);
          return;
        }

        resolve((cacheRequest as any).result?.value || null);
      };

      transaction.onerror = () => reject(transaction.error);
    });
  }

  async delete(key: string): Promise<boolean> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cache', 'metadata'], 'readwrite');
    const cacheStore = transaction.objectStore('cache');
    const metadataStore = transaction.objectStore('metadata');

    return new Promise((resolve, reject) => {
      cacheStore.delete(key);
      metadataStore.delete(key);

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clear(): Promise<boolean> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['cache', 'metadata'], 'readwrite');
    const cacheStore = transaction.objectStore('cache');
    const metadataStore = transaction.objectStore('metadata');

    return new Promise((resolve, reject) => {
      cacheStore.clear();
      metadataStore.clear();

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getSize(): Promise<number> {
    if (!this.db) await this.init();

    const transaction = this.db!.transaction(['metadata'], 'readonly');
    const metadataStore = transaction.objectStore('metadata');

    return new Promise((resolve, reject) => {
      const request = metadataStore.getAll();

      request.onsuccess = () => {
        const totalSize = (request.result as any[]).reduce((sum: number, item: any) => sum + (item.size || 0), 0);
        resolve(totalSize);
      };

      request.onerror = () => reject(request.error);
    });
  }
}

/**
 * Multi-level cache strategy
 */
class MultiLevelCache {
  memoryCache: Map<string, any>;
  indexedDBCache: IndexedDBCache;
  maxMemorySize: number;
  currentMemorySize: number;

  constructor() {
    this.memoryCache = new Map();
    this.indexedDBCache = new IndexedDBCache();
    this.maxMemorySize = 10 * 1024 * 1024;
    this.currentMemorySize = 0;
  }

  async initialize(): Promise<void> {
    try {
      await this.indexedDBCache.init();
      console.log('✅ Multi-level cache initialized');
    } catch (error) {
      console.warn('⚠️  IndexedDB not available, using memory cache only');
    }
  }

  async set(key: string, value: any, options: any = {}): Promise<void> {
    const {
      ttl = 3600000,
      storage = 'memory',
    } = options;

    const size = JSON.stringify(value).length;

    if (storage === 'memory' || storage === 'all') {
      this.memoryCache.set(key, {
        value,
        expiresAt: Date.now() + ttl,
      });

      this.currentMemorySize += size;

      if (this.currentMemorySize > this.maxMemorySize) {
        this.evictMemoryCache();
      }
    }

    if (storage === 'indexeddb' || storage === 'all') {
      try {
        await this.indexedDBCache.set(key, value, ttl);
      } catch (error) {
        console.warn('Failed to write to IndexedDB:', error);
      }
    }
  }

  async get(key: string): Promise<any> {
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
      return memoryEntry.value;
    }

    this.memoryCache.delete(key);

    try {
      const indexedDBValue = await this.indexedDBCache.get(key);
      if (indexedDBValue) {
        this.memoryCache.set(key, {
          value: indexedDBValue,
          expiresAt: Date.now() + 3600000,
        });
        return indexedDBValue;
      }
    } catch (error) {
      console.warn('Failed to read from IndexedDB:', error);
    }

    return null;
  }

  evictMemoryCache(): void {
    const entries = Array.from(this.memoryCache.entries())
      .sort((a: any, b: any) => a[1].expiresAt - b[1].expiresAt);

    const toRemove = Math.ceil(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.memoryCache.delete((entries[i] as any)[0]);
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    this.currentMemorySize = 0;
    try {
      await this.indexedDBCache.clear();
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }
  }
}

export const cacheManager = new MultiLevelCache();

export default {
  IndexedDBCache,
  MultiLevelCache,
  cacheManager,
};
