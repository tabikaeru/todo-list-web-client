import { DndBaseType } from '~/entities/dnd'

export const MAX_TITLE_LENGTH = 10

export interface Category extends DndBaseType {
  title: string
  updatedAt: Date
  createdAt: Date
}

export type CreateCategory = Omit<Category, 'id' | 'updatedAt' | 'createdAt'>
export type UpdateCategory = Omit<Category, 'id' | 'updatedAt'>
