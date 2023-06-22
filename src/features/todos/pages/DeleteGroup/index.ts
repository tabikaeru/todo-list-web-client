import './index.css'
import { deleteGroup, getGroup } from '../../repositories/group'
import { deleteTask, getTasks } from '../../repositories/task'
import { Formatter } from '~/utils/format'

export const DeleteGroupPage = () => ({
  render: async () => {
    const request = Formatter.parseRequestURL()
    const groupId = request.id
    const group = await getGroup(groupId)

    const view = /*html*/ `  
            <section class="delete-group-section delete-group-page-container">  
                <div class="delete-group-title-container">
                  <h1>グループの削除</h1>  
                </div>

                <div class="delete-group-content-container">
                  <div class="delete-group-content-container-inner">
                  <p>
                    ${group.title}グループとこのグループが持つタスクを削除してもよろしいですか?<br>
                    一度削除されたデータは復元できません。削除する際は注意してください。
                  <p>
                    </div>
                  </div>

                <div class="delete-group-control-area">  
                  <div class="primary-control-section">
                    <div class="execute-delete-group-button-wrapper">
                     <button id="execute-delete-group-button" class="execute-delete-group-button">削除</button>                    
                    </div>
                    <div class="cancel-delete-group-button-wrapper" >
                        <button id="cancel-delete-group-button" class="cancel-delete-group-button">キャンセル</button>
                    </div>
                  </div>
                </div>  
            </div>  
        `
    return view
  },
  afterRender: async () => {
    const request = Formatter.parseRequestURL()
    const groupId = request.id

    const executeButton = document.getElementById('execute-delete-group-button') as HTMLDivElement
    const cancelButton = document.getElementById('cancel-delete-group-button') as HTMLDivElement
    const tasks = await getTasks()
    const selectedGroupTasks = tasks.filter((task) => task.groupIDs[0] === groupId)

    executeButton.onclick = async (event) => {
      event.preventDefault()
      await deleteGroup(groupId)
      selectedGroupTasks.forEach(async (task) => {
        await deleteTask(task.id)
      })

      window.history.back()
    }
    cancelButton.onclick = async (event) => {
      event.preventDefault()
      window.history.back()
    }
  },
})
