export type Category = {
  id: string
  title: string
  updatedAt: Date
  createdAt: Date
}

export type CreateCategory = Omit<Category, 'id' | 'updatedAt' | 'createdAt'>
export type UpdateCategory = Omit<Category, 'id' | 'updatedAt'>
