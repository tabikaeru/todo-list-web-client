import { test, expect, describe } from 'vitest'
import { Formatter } from './index'

describe('Formatter', () => {
  test('parseRequestURL should return correct object for root URL', () => {
    window.location.href = 'http:localhost:3000'
    const request = Formatter.parseRequestURL()
    expect(request).toEqual({ resource: '', id: undefined })
  })

  test('parseRequestURL should return correct object for resource URL', () => {
    window.location.href = 'http:localhost:3000/#/createTask'
    const request = Formatter.parseRequestURL()
    expect(request).toEqual({ resource: 'createTask', id: undefined })
  })

  test('parseRequestURL should return correct object for resource with ID URL', () => {
    window.location.href = 'http:localhost:3000/#/updateTask/123'
    const request = Formatter.parseRequestURL()
    expect(request).toEqual({ resource: 'updateTask', id: '123' })
  })
  test('parseRequestURL should return correct object for resource with ID URL verb', () => {
    window.location.href = 'http:localhost:3000/#/deleteTask/123/foo'
    const request = Formatter.parseRequestURL()
    expect(request).toEqual({ resource: 'deleteTask', id: '123', verb: 'foo' })
  })
})
