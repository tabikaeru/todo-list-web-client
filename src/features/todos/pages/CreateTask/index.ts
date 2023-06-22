import './index.css'
import { CreateTask, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../../entities/task'
import { createTask, getTasks } from '../../repositories/task'
import { getCategories } from '../../repositories/category'
import { Formatter } from '~/utils/format'
import { textMaxInputObserver, clickBackButtonsObserver } from '~/utils/element'

export const CreateTaskPage = () => ({
  render: async () => {
    const categories = (await getCategories()).sort((a, b) => b.order - a.order)
    const request = Formatter.parseRequestURL()
    const categoryId = request.id

    const view = /*html*/ `  
            <section class="create-task-section">  
            <h1>タスクの作成</h1>  
              <form id="crate-task-form" class="crate-task-form">    
                <div class="form-item">  
                  <label for="create-task-title">タイトル</label>    
                  <input type="text" id="create-task-title" name="create-task-title" required>    
                  <div id="title-edit-error-message" class="edit-error-message"></div>  
                </div>  
                <div class="form-item">  
                  <label for="create-task-description">詳細</label>    
                  <textarea id="create-task-description" class="create-task-description" name="create-task-description"></textarea>    
                  <div id="description-edit-error-message" class="edit-error-message"></div>  
                </div>  
                <div class="form-item">  
                  <label for="create-task-category">カテゴリー</label>    
                  <select id="create-task-category" name="create-task-category">    
                    ${categories
                      .map((category) => /*html*/ `<option  value="${category.id}" ${categoryId === category.id ? 'selected' : ''} >${category.title}</option>`)
                      .join('\n ')}  
                  </select>    
                </div>  
                <div id="create-task-control-area" class="create-task-control-area">  
                  <div class="primary-control-section">
                    <div class="create-task-submit-wrapper">
                      <input class="create-task-submit" type="submit" value="作成"> 
                    </div>
                    <div class="back-create-task-button-wrapper">
                        <button id="back-create-task-button" class="back-create-task-button">戻る</button>
                    </div>
                  </div>
                </div>  
              </form>  
            </div>  
        `
    return view
  },
  afterRender: async () => {
    const tasks = (await getTasks()).sort((a, b) => a.order - b.order)

    textMaxInputObserver('create-task-title', 'title-edit-error-message', MAX_TITLE_LENGTH)
    textMaxInputObserver('create-task-description', 'description-edit-error-message', MAX_DESCRIPTION_LENGTH)

    const form = document.getElementById('crate-task-form')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const title = (document.getElementById('create-task-title') as HTMLInputElement)?.value as string
      const description = (document.getElementById('create-task-description') as HTMLInputElement).value as string
      const categoryId = (document.getElementById('create-task-category') as HTMLSelectElement).value as string

      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((category) => category.order)) : -1
      const createdTask: CreateTask = {
        title: title,
        description: description,
        categoryIDs: [categoryId],
        order: maxOrder + 1,
      }
      await createTask(createdTask)
      window.history.back()
    })

    clickBackButtonsObserver('back-create-task-button')
  },
})
