export type Task = {
  id: string
  title: string
  description: string
  categoryIDs: string[] //MEMO: 現在は一つのみ
  completed: boolean
  updatedAt: Date
  createdAt: Date
}
export type CreateTask = Omit<Task, 'id' | 'updatedAt' | 'createdAt'>
export type UpdateTask = Omit<Task, 'id' | 'updatedAt'>
