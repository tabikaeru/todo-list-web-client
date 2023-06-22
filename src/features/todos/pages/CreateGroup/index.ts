import './index.css'
import { createGroup, getGroups } from '../../repositories/group'
import { CreateGroup, MAX_TITLE_LENGTH } from '../../entities/group'
import { textMaxInputObserver, clickBackButtonsObserver } from '~/utils/element'

export const CreateGroupPage = () => ({
  render: async () => {
    const view = /*html*/ `  
            <section class="create-group-section">  
            <h1>グループの作成</h1>  
              <form id="create-group-form" class="create-group-form">    
                <div class="form-item">  
                  <label for="create-group-title">タイトル</label>    
                  <input type="text" id="create-group-title" name="create-group-title" required>    
                  <div id="title-edit-error-message" class="edit-error-message"></div>  
                  </div>  
                <div id="create-group-control-area" class="create-group-control-area">  
                  <div class="primary-control-section">
                    <div class="create-group-submit-wrapper">
                      <input class="create-group-submit" type="submit" value="作成"> 
                    </div>
                    <div id="back-create-group-button-wrapper" class="back-create-group-button-wrapper">
                        <button id="back-create-group-button" class="back-create-group-button">戻る</button>
                    </div>
                  </div>
                </div>  
              </form>  
            </div>  
        `
    return view
  },
  afterRender: async () => {
    const form = document.getElementById('create-group-form')
    const groups = await getGroups()
    const maxOrder = Math.max(...groups.map((group) => group.order))
    textMaxInputObserver('create-group-title', 'title-edit-error-message', MAX_TITLE_LENGTH)

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const title = (document.getElementById('create-group-title') as HTMLInputElement)?.value as string

      const createdGroup: CreateGroup = {
        title: title,
        order: maxOrder + 1,
      }
      await createGroup(createdGroup)
      window.history.back()
    })
    clickBackButtonsObserver('back-create-group-button')
  },
})
