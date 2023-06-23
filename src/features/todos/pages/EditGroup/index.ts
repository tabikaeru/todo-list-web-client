import './index.css'
import { UpdateGroup, MAX_TITLE_LENGTH, Group } from '../../entities/group'
import { updateGroup, getGroups, getGroup } from '../../repositories/group'
import { Formatter } from '~/utils/format'
import { textMaxInputObserver, clickBackButtonsObserver } from '~/utils/element'

const changeOrder = async (appending: string, appendedId: string, groups: Group[]) => {
  const appendingIndex = groups.map((group) => group.id).indexOf(appending)
  const appendedIndex = groups.map((group) => group.id).indexOf(appendedId)

  const appendingGroup = groups[appendingIndex]
  const appendedGroup = groups[appendedIndex]

  //MEMO: form lower to higher order
  if (appendingGroup.order < appendedGroup.order) {
    for (let i = appendingIndex + 1; i < appendedIndex; i++) {
      groups[i].order = groups[i].order - 1
      await updateGroup(groups[i].id, groups[i])
    }

    groups[appendingIndex].order = appendedGroup.order
    await updateGroup(groups[appendingIndex].id, groups[appendingIndex])
    groups[appendedIndex].order = appendedGroup.order - 1
    await updateGroup(groups[appendedIndex].id, groups[appendedIndex])

    //MEMO: form higher to lower order
  } else if (appendingGroup.order > appendedGroup.order) {
    for (let i = appendingIndex - 1; i > appendedIndex; i--) {
      groups[i].order = groups[i].order + 1
      await updateGroup(groups[i].id, groups[i])
    }

    groups[appendingIndex].order = appendedGroup.order
    await updateGroup(groups[appendingIndex].id, groups[appendingIndex])
    groups[appendedIndex].order = appendingGroup.order + 1
    await updateGroup(groups[appendedIndex].id, groups[appendedIndex])
  }
}

export const EditGroupPage = () => ({
  render: async () => {
    const request = Formatter.parseRequestURL()
    const groupId = request.id
    const group = await getGroup(groupId)
    const groups = (await getGroups()).sort((a, b) => a.order - b.order)

    const view = /*html*/ `  
            <section class="edit-group-section">  
            <h1>グループの編集</h1>  
              <form id="edit-group-form" class="edit-group-form">    
                <div class="form-item">  
                  <label for="edit-group-title">タイトル</label>    
                  <input type="text" id="edit-group-title" name="edit-group-title" required value="${group.title}">    
                  <div id="title-edit-error-message" class="edit-error-message"></div>  
                </div>
                <div class="form-item">  
                  <label for="edit-group-title">順番</label>    
                  <select id="edit-group-order" name="edit-group-order">  
                    ${groups
                      .map((group) => /*html*/ `<option value="${group.id}" ${groupId === group.id ? 'selected' : ''} >${group.order + 1}</option>`)
                      .join('\n ')}
                  </select>  
                </div>
                <div id="edit-group-control-area" class="edit-group-control-area">  
                  <div class="primary-control-section">
                    <div class="edit-group-submit-wrapper">
                      <input class="edit-group-submit" type="submit" value="更新"> 
                    </div>
                    <div id="back-edit-group-button-wrapper" class="back-edit-group-button-wrapper">
                        <button id="back-edit-group-button" class="back-edit-group-button">戻る</button>
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
    const groupId = request.id

    const form = document.getElementById('edit-group-form')
    const groups = await getGroups()
    const group = await getGroup(groupId)
    textMaxInputObserver('edit-group-title', 'title-edit-error-message', MAX_TITLE_LENGTH)

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const title = (document.getElementById('edit-group-title') as HTMLInputElement)?.value as string
      const appendedGroupId = (document.getElementById('edit-group-order') as HTMLSelectElement).value
      await changeOrder(groupId, appendedGroupId, groups)
      const appendedGroup = groups.find((group) => group.id === appendedGroupId)

      const updatedGroup: UpdateGroup = {
        title: title,
        order: appendedGroup.order - 1,
        createdAt: group.createdAt,
      }
      await updateGroup(groupId, updatedGroup)
      window.history.back()
    })

    clickBackButtonsObserver('back-edit-group-button')
  },
})
