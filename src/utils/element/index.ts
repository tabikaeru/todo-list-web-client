export const textMaxInputObserver = (textElementId: string, warningElementId: string, maxLength: number) => {
  const textInput = document.getElementById(textElementId) as HTMLInputElement | HTMLTextAreaElement
  textInput.maxLength = maxLength
  textInput.addEventListener('input', () => {
    if (textInput.value.length >= textInput.maxLength) {
      textInput.value = textInput.value.slice(0, textInput.maxLength)
      document.getElementById(warningElementId).textContent = `${maxLength}文字以下で入力してください`
    } else {
      document.getElementById(warningElementId).textContent = ''
    }
  })
}

export const clickRoutingButtonsObserver = (className: string, path: string, isContainValue: boolean) => {
  const buttons = document.querySelectorAll(`.${className}`)
  buttons.forEach((button: HTMLButtonElement) =>
    button.addEventListener('click', () => {
      location.hash = isContainValue ? `#/${path}/${button.value}` : `#/${path}`
    })
  )
}

export const clickBackButtonsObserver = (elementId: string) => {
  const backButton = document.getElementById(elementId)
  backButton.addEventListener('click', (e) => {
    e.preventDefault()
    window.history.back()
  })
}
