import { Category } from '~/features/todos/entities/catagory'
import { Task } from '~/features/todos/entities/task'

export const DB_NAME = 'todo-list'
export const DB_VERSION = 1

export type DbStoreConfig = {
  [key: string]: {
    storeName: string
    databaseKeyPath: string
    initialData: Task[] | Category[] | null
  }
}

export const DB_STORE_CONFIGS: DbStoreConfig = {
  categories: {
    storeName: 'categories',
    databaseKeyPath: 'id',
    initialData: [
      {
        id: 'category-1-todo',
        title: 'やること',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 'category-2-in-progress',
        title: '作業中',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 'category-4-finished',
        title: '完了',
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ],
  },
  tasks: {
    storeName: 'tasks',
    databaseKeyPath: 'id',
    initialData: null,
  },
}
