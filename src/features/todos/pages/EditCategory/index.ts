import './index.css'
import { UpdateCategory, MAX_TITLE_LENGTH, Category } from '../../entities/category'
import { updateCategory, getCategories, getCategory } from '../../repositories/category'
import { Formatter } from '~/utils/format'
import { textMaxInputObserver, clickBackButtonsObserver } from '~/utils/element'

const changeOrder = async (appending: string, appendedId: string, categories: Category[]) => {
  const appendingIndex = categories.map((category) => category.id).indexOf(appending)
  const appendedIndex = categories.map((category) => category.id).indexOf(appendedId)

  const appendingCategory = categories[appendingIndex]
  const appendedCategory = categories[appendedIndex]

  //MEMO: form lower to higher order
  if (appendingCategory.order < appendedCategory.order) {
    for (let i = appendingIndex + 1; i < appendedIndex; i++) {
      categories[i].order = categories[i].order - 1
      await updateCategory(categories[i].id, categories[i])
    }

    categories[appendingIndex].order = appendedCategory.order
    await updateCategory(categories[appendingIndex].id, categories[appendingIndex])
    categories[appendedIndex].order = appendedCategory.order - 1
    await updateCategory(categories[appendedIndex].id, categories[appendedIndex])

    //MEMO: form higher to lower order
  } else if (appendingCategory.order > appendedCategory.order) {
    for (let i = appendingIndex - 1; i > appendedIndex; i--) {
      categories[i].order = categories[i].order + 1
      await updateCategory(categories[i].id, categories[i])
    }

    categories[appendingIndex].order = appendedCategory.order
    await updateCategory(categories[appendingIndex].id, categories[appendingIndex])
    categories[appendedIndex].order = appendingCategory.order + 1
    await updateCategory(categories[appendedIndex].id, categories[appendedIndex])
  }
}

export const EditCategoryPage = () => ({
  render: async () => {
    const request = Formatter.parseRequestURL()
    const categoryId = request.id
    const category = await getCategory(categoryId)
    const categories = (await getCategories()).sort((a, b) => a.order - b.order)

    const view = /*html*/ `  
            <section class="edit-category-section">  
            <h1>カテゴリの編集</h1>  
              <form id="edit-category-form" class="edit-category-form">    
                <div class="form-item">  
                  <label for="edit-category-title">タイトル</label>    
                  <input type="text" id="edit-category-title" name="edit-category-title" required value="${category.title}">    
                  <div id="title-edit-error-message" class="edit-error-message"></div>  
                </div>
                <div class="form-item">  
                  <select id="edit-category-order" name="edit-category-order">  
                    ${categories
                      .map(
                        (category) => /*html*/ `<option value="${category.id}" ${categoryId === category.id ? 'selected' : ''} >${category.order + 1}</option>`
                      )
                      .join('\n ')}
                  </select>  
                </div>
                <div id="edit-category-control-area" class="edit-category-control-area">  
                  <div class="primary-control-section">
                    <div class="edit-category-submit-wrapper">
                      <input class="edit-category-submit" type="submit" value="更新"> 
                    </div>
                    <div id="back-edit-category-button-wrapper" class="back-edit-category-button-wrapper">
                        <button id="back-edit-category-button" class="back-edit-category-button">戻る</button>
                    </div>
                  </div>
                </div>  
              </form>  
            </div>  
        `
    return view
  },
  afterRender: async () => {
    const request = Formatter.parseRequestURL()
    const categoryId = request.id

    const form = document.getElementById('edit-category-form')
    const categories = await getCategories()
    const category = await getCategory(categoryId)
    textMaxInputObserver('edit-category-title', 'title-edit-error-message', MAX_TITLE_LENGTH)

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const title = (document.getElementById('edit-category-title') as HTMLInputElement)?.value as string
      const appendedCategoryId = (document.getElementById('edit-category-order') as HTMLSelectElement).value
      await changeOrder(categoryId, appendedCategoryId, categories)
      const appendedCategory = categories.find((category) => category.id === appendedCategoryId)

      const updatedCategory: UpdateCategory = {
        title: title,
        order: appendedCategory.order - 1,
        createdAt: category.createdAt,
      }
      await updateCategory(categoryId, updatedCategory)
      window.history.back()
    })

    clickBackButtonsObserver('back-edit-category-button')
  },
})
