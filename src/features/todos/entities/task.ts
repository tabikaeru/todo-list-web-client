import { DndBaseType } from '~/entities/dnd'

export const MAX_TITLE_LENGTH = 20
export const MAX_DESCRIPTION_LENGTH = 500

export interface Task extends DndBaseType {
  id: string
  title: string
  description: string
  groupIDs: string[] //MEMO: 現在は一つのみ
  updatedAt: Date
  createdAt: Date
}
export type CreateTask = Omit<Task, 'id' | 'updatedAt' | 'createdAt'>
export type UpdateTask = Omit<Task, 'id' | 'updatedAt'>
