import './index.css'
import { createCategory, getCategories } from '../../repositories/category'
import { CreateCategory, MAX_TITLE_LENGTH } from '../../entities/category'
import { textMaxInputObserver, clickBackButtonsObserver } from '~/utils/element'

export const CreateCategoryPage = () => ({
  render: async () => {
    const view = /*html*/ `  
            <section class="create-category-section">  
            <h1>カテゴリの作成</h1>  
              <form id="create-category-form" class="create-category-form">    
                <div class="form-item">  
                  <label for="create-category-title">タイトル</label>    
                  <input type="text" id="create-category-title" name="create-category-title" required>    
                  <div id="title-edit-error-message" class="edit-error-message"></div>  
                  </div>  
                <div id="create-category-control-area" class="create-category-control-area">  
                  <div class="primary-control-section">
                    <div class="create-category-submit-wrapper">
                      <input class="create-category-submit" type="submit" value="作成"> 
                    </div>
                    <div id="back-create-category-button-wrapper" class="back-create-category-button-wrapper">
                        <button id="back-create-category-button" class="back-create-category-button">戻る</button>
                    </div>
                  </div>
                </div>  
              </form>  
            </div>  
        `
    return view
  },
  afterRender: async () => {
    const form = document.getElementById('create-category-form')
    const categories = await getCategories()
    const maxOrder = Math.max(...categories.map((category) => category.order))
    textMaxInputObserver('create-category-title', 'title-edit-error-message', MAX_TITLE_LENGTH)

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const title = (document.getElementById('create-category-title') as HTMLInputElement)?.value as string

      const createdCategory: CreateCategory = {
        title: title,
        order: maxOrder + 1,
      }
      await createCategory(createdCategory)
      window.history.back()
    })
    clickBackButtonsObserver('back-create-category-button')
  },
})
