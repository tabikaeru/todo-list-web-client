import './index.css'
import { deleteCategory, getCategory } from '../../repositories/category'
import { deleteTask, getTasks } from '../../repositories/task'
import { Formatter } from '~/utils/format'

export const DeleteCategoryPage = () => ({
  render: async () => {
    const request = Formatter.parseRequestURL()
    const categoryId = request.id
    const category = await getCategory(categoryId)

    const view = /*html*/ `  
            <section class="delete-category-section delete-category-page-container">  
                <div class="delete-category-title-container">
                  <h1>カテゴリの削除</h1>  
                </div>

                <div class="delete-category-content-container">
                  <div class="delete-category-content-container-inner">
                  <p>
                    ${category.title}カテゴリーとこのカテゴリーが持つタスクを削除してもよろしいですか?<br>
                    一度削除されたデータは復元できません。削除する際は注意してください。
                  <p>
                    </div>
                  </div>

                <div class="delete-category-control-area">  
                  <div class="primary-control-section">
                    <div class="execute-delete-category-button-wrapper">
                     <button id="execute-delete-category-button" class="execute-delete-category-button">削除</button>                    
                    </div>
                    <div class="cancel-delete-category-button-wrapper" >
                        <button id="cancel-delete-category-button" class="cancel-delete-category-button">キャンセル</button>
                    </div>
                  </div>
                </div>  
            </div>  
        `
    return view
  },
  afterRender: async () => {
    const request = Formatter.parseRequestURL()
    const categoryId = request.id

    const executeButton = document.getElementById('execute-delete-category-button') as HTMLDivElement
    const cancelButton = document.getElementById('cancel-delete-category-button') as HTMLDivElement
    const tasks = await getTasks()
    const selectedCategoryTasks = tasks.filter((task) => task.categoryIDs[0] === categoryId)
    selectedCategoryTasks.forEach(async (task) => {
      await deleteTask(task.id)
    })

    executeButton.onclick = async (event) => {
      event.preventDefault()
      await deleteCategory(categoryId)
      window.history.back()
    }
    cancelButton.onclick = async (event) => {
      event.preventDefault()
      window.history.back()
    }
  },
})
