import { openDB } from '~/lib/indexedDB'
import { Category, CreateCategory, UpdateCategory } from '../entities/catagory'
import { generateRandomId } from '~/utils/id'

const STORE_NAME = 'categories'

export const getCategory = async (categoryId: string): Promise<Category | undefined> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const objectStore = transaction.objectStore(STORE_NAME)

    const request = objectStore.get(categoryId)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('Error getting category item from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const objectStore = transaction.objectStore(STORE_NAME)

    const request = objectStore.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(new Error('Error getting category items from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const createCategory = async (category: CreateCategory): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)
    const id = generateRandomId()
    const now = new Date()

    const newCategory: Category = {
      ...category,
      id,
      updatedAt: now,
      createdAt: now,
    }
    const request = objectStore.add(newCategory)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error adding category item to indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const updateCategory = async (id: string, category: UpdateCategory): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    const now = new Date()

    const newCategory: Category = {
      ...category,
      id,
      updatedAt: now,
    }

    const request = objectStore.put(newCategory)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error updating category item in indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    const request = objectStore.delete(categoryId)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error deleting category item from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}
