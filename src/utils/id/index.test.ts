import { test, expect, describe } from 'vitest'
import { generateRandomId } from './index'

describe('generateRandomId', () => {
  test('returns a string of the specified length', () => {
    const length = 10
    const id = generateRandomId(length)
    expect(id).toHaveLength(length)
  })

  test('returns a different id each time', () => {
    const id1 = generateRandomId()
    const id2 = generateRandomId()
    expect(id1).not.toEqual(id2)
  })

  test('returns a string containing only alphanumeric characters', () => {
    const id = generateRandomId()
    const alphanumericRegex = /^[a-z0-9]+$/i
    expect(alphanumericRegex.test(id)).toBe(true)
  })
})
