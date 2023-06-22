import './index.css'

type Size = 'small' | 'medium' | 'large'

type Props = {
  modalId: string
  openModalButtonId: string
  size?: Size
  title: string
  description: string
  executeButtonText: string
  cancelButtonText: string
  onClickExecuteButton: (event: MouseEvent) => void | Promise<void>
  onClickCancelButton: (event: MouseEvent) => void | Promise<void>
}

export const Modal = ({
  modalId,
  openModalButtonId,
  size = 'medium',
  title,
  description,
  executeButtonText,
  cancelButtonText,
  onClickExecuteButton,
  onClickCancelButton,
}: Props) => ({
  render: async () => {
    const view = /*html*/ `
            <dialog id="${modalId}" class="modal">  
                <div class="modal-base-content ${size}-modal-content">  
                  <div class="header-modal-container"> 
                      <h1>${title}</h1>
                  </div>
                  <div class="content-modal-container"> 
                      <p>${description}</p>  
                  </div>
                  <div class="control-modal-container">  
                    <div class="control-modal-area">
                      <button id="execute-modal-button" class="modal-button execute-modal-button" >${executeButtonText}</button>  
                      <button id="cancel-modal-button" class="modal-button cancel-modal-button" >${cancelButtonText}</button>  
                    </div>
                  </div>
                </div>  
            </dialog>
        `
    return view
  },
  afterRender: async () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement
    const openModalButton = document.getElementById(openModalButtonId) as HTMLButtonElement
    const executeButton = document.getElementById('execute-modal-button') as HTMLButtonElement
    const cancelButton = document.getElementById('cancel-modal-button') as HTMLButtonElement

    executeButton.onclick = async (event) => {
      event.preventDefault()
      await onClickExecuteButton(event)
      modal.close()
    }
    cancelButton.onclick = async (event) => {
      event.preventDefault()
      await onClickCancelButton(event)
      modal.close()
    }

    openModalButton.onclick = (event) => {
      event.preventDefault()
      modal.showModal()
    }

    // MEMO: モーダルの外側をクリックしたときの処理
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.close()
      }
    }
  },
})
