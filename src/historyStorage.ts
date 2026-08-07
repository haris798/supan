import { MetricHistoryPoint, TableInfo } from './types';

const DB_NAME = 'SupanMetricsDB';
const DB_VERSION = 1;
const STORE_METRICS = 'metrics_history';
const STORE_TABLES = 'table_snapshots';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_METRICS)) {
        db.createObjectStore(STORE_METRICS, { keyPath: 'timestamp' });
      }
      if (!db.objectStoreNames.contains(STORE_TABLES)) {
        db.createObjectStore(STORE_TABLES, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Save telemetry history point to IndexedDB */
export async function saveMetricHistoryToIDB(points: MetricHistoryPoint[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_METRICS, 'readwrite');
    const store = tx.objectStore(STORE_METRICS);

    // Keep up to last 720 points (30 days of hourly points)
    const recentPoints = points.slice(-720);
    for (const pt of recentPoints) {
      store.put(pt);
    }
  } catch (err) {
    console.warn('Failed to save metrics to IndexedDB:', err);
  }
}

/** Retrieve telemetry history points from IndexedDB */
export async function getMetricHistoryFromIDB(): Promise<MetricHistoryPoint[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_METRICS, 'readonly');
      const store = tx.objectStore(STORE_METRICS);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as MetricHistoryPoint[]) || [];
        // Sort chronologically
        results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('Failed to read metrics from IndexedDB:', err);
    return [];
  }
}

/** Save table snapshot to IndexedDB */
export async function saveTableSnapshotsToIDB(tables: TableInfo[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_TABLES, 'readwrite');
    const store = tx.objectStore(STORE_TABLES);

    const now = new Date().toISOString();
    for (const table of tables) {
      store.put({
        ...table,
        lastSnapshotAt: now
      });
    }
  } catch (err) {
    console.warn('Failed to save table snapshots to IndexedDB:', err);
  }
}

/** Clear old history points older than maxDays */
export async function purgeOldHistoryFromIDB(maxDays = 30): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_METRICS, 'readwrite');
    const store = tx.objectStore(STORE_METRICS);
    const request = store.getAll();

    request.onsuccess = () => {
      const items = (request.result as MetricHistoryPoint[]) || [];
      const cutoffTime = Date.now() - maxDays * 24 * 60 * 60 * 1000;

      for (const item of items) {
        if (new Date(item.timestamp).getTime() < cutoffTime) {
          store.delete(item.timestamp);
        }
      }
    };
  } catch (err) {
    console.warn('Failed to purge old IndexedDB history:', err);
  }
}
