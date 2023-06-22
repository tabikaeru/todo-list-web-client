import { test, expect, describe, vi } from 'vitest'
import { textMaxInputObserver, clickRoutingButtonsObserver, clickBackButtonsObserver } from './index'

test('textMaxInputObserver should limit input length and display warning', () => {
  document.body.innerHTML = `  
      <input id="text-input" type="text">  
      <div id="warning"></div>  
    `
  const textElementId = 'text-input'
  const warningElementId = 'warning'
  const maxLength = 5
  textMaxInputObserver(textElementId, warningElementId, maxLength)
  const textInput = document.getElementById(textElementId) as HTMLInputElement

  // Test input length limiting
  textInput.value = '123456789'
  textInput.dispatchEvent(new Event('input'))
  expect(textInput.value).toBe('12345')

  // Test warning display
  const warning = document.getElementById(warningElementId)
  expect(warning.textContent).toBe(`${maxLength}文字以下で入力してください`)

  // Test warning removal
  textInput.value = '1234'
  textInput.dispatchEvent(new Event('input'))
  expect(warning.textContent).toBe('')
})

describe('clickRoutingButtonsObserver', () => {
  test('should update the URL hash with path and button value', () => {
    document.body.innerHTML = `  
        <button class="routing-button" value="123">Button 1</button>  
        <button class="routing-button" value="456">Button 2</button>  
      `
    const className = 'routing-button'
    const path = 'example'
    const isContainValue = true

    clickRoutingButtonsObserver(className, path, isContainValue)

    const button1 = document.querySelector('.routing-button') as HTMLButtonElement
    button1.click()

    expect(location.hash).toBe(`#/${path}/${button1.value}`)
  })
})

describe('clickBackButtonsObserver', () => {
  test('should go back in browser history when clicked', () => {
    document.body.innerHTML = `  
        <a href="#" id="back-button">Back</a>  
      `
    const elementId = 'back-button'

    clickBackButtonsObserver(elementId)

    const backButton = document.getElementById(elementId) as HTMLAnchorElement
    const spy = vi.spyOn(window.history, 'back')
    backButton.click()

    expect(spy).toHaveBeenCalled()
  })
})
