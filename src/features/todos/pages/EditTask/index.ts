import './index.css'
import { UpdateTask } from '../../entities/task'
import { Modal } from '~/components/Modal'
import { updateTask, getTask, deleteTask } from '../../repositories/task'
import { getCategories } from '../../repositories/category'
import { Formatter } from '~/utils/format'
const MODAL_ID = 'delete-task-edit-modal'
const MODEL_OPEN_BUTTON_ID = 'delete-task-edit-button'

export const EditTaskPage = () => ({
  render: async () => {
    const categories = (await getCategories()).sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
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
                </div>
                <div class="form-item">  
                  <label for="edit-task-description">詳細</label>  
                  <textarea id="edit-task-description" class="edit-task-description" name="edit-task-description" required >${task.description}</textarea>  
                  </div>
                <label for="create-task-category">カテゴリー</label>  
                <div class="form-item">  
                  <select id="create-task-category" name="create-task-category">  
                    ${categories
                      .map(
                        (category) =>
                          /*html*/ `<option  value="${category.id}" ${task.categoryIDs[0] === category.id ? 'selected' : ''} >${category.title}</option>`
                      )
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

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const title = (document.getElementById('edit-task-title') as HTMLInputElement)?.value as string
      const description = (document.getElementById('edit-task-description') as HTMLInputElement).value as string
      const categoryId = (document.getElementById('create-task-category') as HTMLSelectElement).value as string

      const updatedTask: UpdateTask = {
        title: title,
        description: description,
        categoryIDs: [categoryId],
        completed: false,
        createdAt: task.createdAt,
      }
      await updateTask(taskId, updatedTask)
      window.history.back()
    })

    const backButton = document.getElementById('back-task-edit-button')

    backButton.addEventListener('click', (e) => {
      e.preventDefault()
      window.history.back()
    })

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
