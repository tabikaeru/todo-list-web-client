import './index.css'
import { getGroups, updateGroup } from '../../repositories/group'
import { getTasks, updateTask } from '../../repositories/task'
import { useDnd } from '~/utils/dnd'
import { clickRoutingButtonsObserver } from '~/utils/element'
export const HomePage = () => ({
  render: async () => {
    const tasks = (await getTasks()).sort((a, b) => a.order - b.order)
    const groups = (await getGroups()).sort((a, b) => a.order - b.order)

    const view = /*html*/ `  
    <section class="home-task-section">  
    <div id="board">  
      ${
        groups?.length > 0
          ? groups
              .map(
                (group) => /*html*/ `  
                <div id="${group.id}" class="group-outer">  
                  <div  class="group" >  
                    <div class="group-header">  
                      <h2>${group.title}</h2>  
                      <div class="icon-container" class="group-menu">  
                        <p class="three-dot-icon" class="group-menu">･･･</p>  
                        <div id="menu-container" class="menu-container group-menu" >  
                          <ul class="group-menu">  
                            <li value="${group.id}" class="group-menu">  
                              <button class="edit-group-button group-menu" value="${group.id}">  
                                <p class="group-menu">このグループを編集</p>  
                              </button>  
                            </li>  
                            <li value="${group.id}" class="group-menu">  
                              <button class="delete-group-button group-menu" value="${group.id}">  
                                  <p style="color: #c00;" class="group-menu">このグループを削除</p>  
                              </button>  
                            </li>  
                          </ul>  
                        </div>  
                      </div>  
                    </div>  
                    <div id="group-cards" class="group-cards" >  
                      ${
                        tasks?.length > 0
                          ? tasks
                              .filter((task) => task?.groupIDs?.length && task?.groupIDs[0] === group.id)
                              ?.map(
                                (task) => /*html*/ `  
                                <div class="card-outer" id="${task.id}">  
                                  <div class="card" role="button" tabindex="0" onclick="location.href='#/editTask/${task.id}'">  
                                    <p>${task.title}</p>  
                                  </div>  
                                </div>  
                              `
                              )
                              .join('\n ')
                          : ''
                      }  
                    </div>  
                    <div class="group-footer">  
                      <button value="${group.id}" class="add-task-button">タスク追加</button>  
                    </div>  
                  </div>  
                </div>  
              `
              )
              .join('\n ')
          : ''
      }  
      <div class="add-group-outer">  
        <div class="add-group">  
          <button id="add-group-button" class="add-group-button">  
            <span class="add-group-button-text">+ グループを追加</span>  
          </button>  
        </div>  
      </div>  
    </div>  
  </section>  
        `
    return view
  },
  afterRender: async () => {
    const tasks = (await getTasks()).sort((a, b) => a.order - b.order)
    const groups = (await getGroups()).sort((a, b) => a.order - b.order)

    const addGroupButton = document.getElementById('add-group-button')
    addGroupButton.addEventListener('click', (event) => {
      event.preventDefault()
      location.hash = `#/createGroup`
    })

    const iconContainers = document.querySelectorAll('.icon-container')
    iconContainers.forEach((iconContainer: HTMLDivElement) => {
      iconContainer.addEventListener('click', (event) => {
        const childNode = iconContainer.querySelector('.menu-container') as HTMLDivElement
        childNode.style.display = 'block'
        event.stopPropagation()
      })
    })

    iconContainers.forEach((iconContainer: HTMLDivElement) => {
      iconContainer.addEventListener('mouseleave', () => {
        const childNode = iconContainer.children[1] as HTMLDivElement
        childNode.style.display = 'none'
      })
    })
    //MEMO: close the group menu by touching screen
    window.ontouchstart = (event: TouchEvent) => {
      const menuContainers = document.querySelectorAll('.menu-container')
      menuContainers.forEach((menuContainer: HTMLDivElement) => {
        if ((event.target as HTMLElement).classList.contains('group-menu')) return
        menuContainer.style.display = 'none'
      })
    }
    clickRoutingButtonsObserver('add-task-button', 'createTask', true)
    clickRoutingButtonsObserver('delete-group-button', 'deleteGroup', true)
    clickRoutingButtonsObserver('edit-group-button', 'editGroup', true)

    useDnd('card-outer', 'group-outer', tasks, groups, 'groupIDs', updateTask, updateGroup)
  },
})
