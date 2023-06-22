import { openDB } from '~/lib/indexedDB'
import { Group, CreateGroup, UpdateGroup } from '../entities/group'
import { generateRandomId } from '~/utils/id'

const STORE_NAME = 'groups'

export const getGroup = async (groupId: string): Promise<Group | undefined> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const objectStore = transaction.objectStore(STORE_NAME)

    const request = objectStore.get(groupId)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('Error getting group item from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const getGroups = async (): Promise<Group[]> => {
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
        reject(new Error('Error getting group items from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const createGroup = async (group: CreateGroup): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)
    const id = generateRandomId()
    const now = new Date()

    const newGroup: Group = {
      ...group,
      id,
      updatedAt: now,
      createdAt: now,
    }
    const request = objectStore.add(newGroup)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error adding group item to indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const updateGroup = async (id: string, group: UpdateGroup): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    const now = new Date()

    const newGroup: Group = {
      ...group,
      id,
      updatedAt: now,
    }

    const request = objectStore.put(newGroup)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error updating group item in indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const deleteGroup = async (groupId: string): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    const request = objectStore.delete(groupId)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error deleting group item from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}
