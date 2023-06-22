import './index.css'
import { UpdateTask, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../../entities/task'
import { Modal } from '~/components/Modal'
import { updateTask, getTask, deleteTask } from '../../repositories/task'
import { getGroups } from '../../repositories/group'
import { Formatter } from '~/utils/format'
import { textMaxInputObserver, clickBackButtonsObserver } from '~/utils/element'
const MODAL_ID = 'delete-task-edit-modal'
const MODEL_OPEN_BUTTON_ID = 'delete-task-edit-button'

export const EditTaskPage = () => ({
  render: async () => {
    const groups = (await getGroups()).sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
    const request = Formatter.parseRequestURL()
    const taskId = request.id
    const task = await getTask(taskId)
    const onClickExecuteButton = async (event: MouseEvent) => {
      event.preventDefault()
      await deleteTask(taskId)
      window.history.back()
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    const onClickCancelButton = (_event: MouseEvent) => {}

    const view = /*html*/ `  
            <section class="edit-task-section">  
            <h1>タスクの編集</h1>  
              <form id="edit-task-todo-form" class="edit-task-todo-form">  
                <div class="form-item">  
                  <label for="edit-task-title" >タイトル</label>  
                  <input type="text" id="edit-task-title" name="edit-task-title" required value="${task.title}">  
                  <div id="title-edit-error-message" class="edit-error-message"></div>  
                </div>
                <div class="form-item">  
                  <label for="edit-task-description">詳細</label>  
                  <textarea id="edit-task-description" class="edit-task-description" name="edit-task-description">${task.description}</textarea>  
                  <div id="description-edit-error-message" class="edit-error-message"></div>  
                </div>
                <label for="create-task-group">グループ</label>  
                <div class="form-item">  
                  <select id="create-task-group" name="create-task-group">  
                    ${groups
                      .map((group) => /*html*/ `<option  value="${group.id}" ${task.groupIDs[0] === group.id ? 'selected' : ''} >${group.title}</option>`)
                      .join('\n ')}
                  </select>  
                </div>
                <div id="edit-task-control-area" class="edit-task-control-area">
                  <div class="primary-control-section">
                    <div class="edit-task-submit-wrapper">
                      <input class="edit-task-submit" type="submit" value="更新"> 
                    </div>
                    <div id="back-task-edit-button-wrapper" class="back-task-edit-button-wrapper">
                        <button id="back-task-edit-button" class="back-task-edit-button">戻る</button>
                    </div>
                  </div>
                  <div class="secondary-control-section">
                    <div class="delete-task-edit-button-wrapper">
                      <button id="${MODEL_OPEN_BUTTON_ID}" class="${MODEL_OPEN_BUTTON_ID}">削除</button>
                    </div>
                  </div>
                </div>
              </form>  
            </div>  
            ${await Modal({
              modalId: MODAL_ID,
              openModalButtonId: MODEL_OPEN_BUTTON_ID,
              title: 'タスクを削除',
              description: '本当にこのタスクを削除してもよろしいですか？',
              executeButtonText: '削除',
              cancelButtonText: 'キャンセル',
              onClickExecuteButton: onClickExecuteButton,
              onClickCancelButton: onClickCancelButton,
            }).render()}
        `
    return view
  },
  afterRender: async () => {
    const form = document.getElementById('edit-task-todo-form')
    const request = Formatter.parseRequestURL()
    const taskId = request.id
    const task = await getTask(taskId)

    textMaxInputObserver('edit-task-title', 'title-edit-error-message', MAX_TITLE_LENGTH)
    textMaxInputObserver('edit-task-description', 'description-edit-error-message', MAX_DESCRIPTION_LENGTH)

    form.addEventListener('submit', async (e) => {
      const title = (document.getElementById('edit-task-title') as HTMLInputElement)?.value as string
      const description = (document.getElementById('edit-task-description') as HTMLInputElement).value as string
      const groupId = (document.getElementById('create-task-group') as HTMLSelectElement).value as string

      e.preventDefault()

      const updatedTask: UpdateTask = {
        title: title,
        description: description,
        groupIDs: [groupId],
        order: task.order,
        createdAt: task.createdAt,
      }

      await updateTask(taskId, updatedTask)
      window.history.back()
    })

    clickBackButtonsObserver('back-task-edit-button')

    const onClickExecuteButton = async (event: MouseEvent) => {
      event.preventDefault()
      await deleteTask(taskId)
      window.history.back()
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    const onClickCancelButton = (_event: MouseEvent) => {}
    await Modal({
      modalId: MODAL_ID,
      openModalButtonId: MODEL_OPEN_BUTTON_ID,
      title: 'タスクを削除',
      description: '本当にこのタスクを削除してもよろしいですか？',
      executeButtonText: '削除',
      cancelButtonText: 'キャンセル',
      onClickExecuteButton: onClickExecuteButton,
      onClickCancelButton: onClickCancelButton,
    }).afterRender()
  },
})
