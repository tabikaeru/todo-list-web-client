import { DndBaseType } from '~/entities/dnd'

export const MAX_TITLE_LENGTH = 10

export interface Group extends DndBaseType {
  title: string
  updatedAt: Date
  createdAt: Date
}

export type CreateGroup = Omit<Group, 'id' | 'updatedAt' | 'createdAt'>
export type UpdateGroup = Omit<Group, 'id' | 'updatedAt'>
