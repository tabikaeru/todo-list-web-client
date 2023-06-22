export const textMaxInputObserver = (textElementId: string, warningElementId: string, maxLength: number) => {
  const titleTextInput = document.getElementById(textElementId) as HTMLInputElement | HTMLTextAreaElement
  titleTextInput.maxLength = maxLength
  titleTextInput.addEventListener('input', () => {
    if (titleTextInput.value.length >= titleTextInput.maxLength) {
      titleTextInput.value = titleTextInput.value.slice(0, titleTextInput.maxLength)
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
