import { initializeDB } from '~/lib/indexedDB'

export const dbProvider = async () => {
  try {
    await initializeDB()
  } catch (e) {
    console.warn(e)
  }
}
