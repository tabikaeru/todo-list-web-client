import { openDB } from '~/lib/indexedDB'
import { Task, CreateTask, UpdateTask } from '../entities/task'
import { generateRandomId } from '~/utils/id'

const STORE_NAME = 'tasks'

export const getTask = async (taskId: string): Promise<Task | undefined> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const objectStore = transaction.objectStore(STORE_NAME)

    const request = objectStore.get(taskId)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result)
      }
      request.onerror = () => {
        reject(new Error('Error getting todo item from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const getTasks = async (): Promise<Task[]> => {
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
        reject(new Error('Error getting todo items from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const createTask = async (task: CreateTask): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)
    const id = generateRandomId()
    const now = new Date()

    const newTask: Task = {
      ...task,
      id,
      updatedAt: now,
      createdAt: now,
    }
    const request = objectStore.add(newTask)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error adding todo item to indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}

export const updateTask = async (id: string, task: UpdateTask): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    const now = new Date()

    const newTask: Task = {
      ...task,
      id,
      updatedAt: now,
    }

    const request = objectStore.put(newTask)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error updating todo item in indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}
export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const objectStore = transaction.objectStore(STORE_NAME)

    const request = objectStore.delete(taskId)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error('Error deleting todo item from indexedDB instance'))
      }
    })
  } catch (error) {
    console.error('Error accessing indexedDB instance', error)
  }
}
