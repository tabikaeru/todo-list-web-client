import { DB_NAME, DB_VERSION, DB_STORE_CONFIGS } from '~/config'

export const openDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const indexed = indexedDB.open(DB_NAME, DB_VERSION)

    indexed.onsuccess = function (event) {
      const db = indexed.result
      resolve(db)
    }

    indexed.onerror = (): void => {
      reject(new Error('Failed to initialize the database.'))
    }
  })
}

export const initializeDB = () => {
  const indexed = indexedDB.open(DB_NAME, DB_VERSION)
  indexed.onupgradeneeded = (event: IDBVersionChangeEvent): void => {
    const db: IDBDatabase = (event.target as IDBOpenDBRequest).result
    for (const key in DB_STORE_CONFIGS) {
      const dbStoreConfig = DB_STORE_CONFIGS[key]
      if (!db.objectStoreNames.contains(dbStoreConfig.storeName)) {
        const objectStore = db.createObjectStore(dbStoreConfig.storeName, {
          keyPath: dbStoreConfig.databaseKeyPath,
        })
        dbStoreConfig.initialData &&
          dbStoreConfig.initialData.forEach((data) => {
            objectStore.add(data)
          })
      }
    }
  }

  indexed.onerror = (): void => {
    throw new Error('Failed to initialize the database.')
  }
}
