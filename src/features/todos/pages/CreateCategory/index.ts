import './index.css'
import { createCategory } from '../../repositories/category'
import { CreateCategory } from '../../entities/catagory'

export const CreateCategoryPage = () => ({
  render: async () => {
    const view = /*html*/ `  
            <section class="create-category-section">  
            <h1>カテゴリの作成</h1>  
              <form id="create-category-form" class="create-category-form">    
                <div class="form-item">  
                  <label for="create-category-title">タイトル</label>    
                  <input type="text" id="create-category-title" name="create-category-title" required>    
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const title = (document.getElementById('create-category-title') as HTMLInputElement)?.value as string

      const createdCategory: CreateCategory = {
        title: title,
      }
      await createCategory(createdCategory)
      window.history.back()
    })

    const backButton = document.getElementById('back-create-category-button')
    backButton.addEventListener('click', (e) => {
      e.preventDefault()
      window.history.back()
    })
  },
})
