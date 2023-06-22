import './index.css'
import { getCategories, updateCategory } from '../../repositories/category'
import { getTasks, updateTask } from '../../repositories/task'
import { useDnd } from '~/utils/dnd'
import { clickRoutingButtonsObserver } from '~/utils/element'
export const HomePage = () => ({
  render: async () => {
    const tasks = (await getTasks()).sort((a, b) => a.order - b.order)
    const categories = (await getCategories()).sort((a, b) => a.order - b.order)

    const view = /*html*/ `  
    <section class="home-task-section">  
    <div id="board">  
      ${
        categories?.length > 0
          ? categories
              .map(
                (category) => /*html*/ `  
                <div id="${category.id}" class="category-outer">  
                  <div  class="category" >  
                    <div class="category-header">  
                      <h2>${category.title}</h2>  
                      <div class="icon-container" class="category-menu">  
                        <p class="three-dot-icon" class="category-menu">･･･</p>  
                        <div id="menu-container" class="menu-container category-menu" >  
                          <ul class="category-menu">  
                            <li value="${category.id}" class="category-menu">  
                              <button class="edit-category-button category-menu" value="${category.id}">  
                                <p class="category-menu">このカテゴリを編集</p>  
                              </button>  
                            </li>  
                            <li value="${category.id}" class="category-menu">  
                              <button class="delete-category-button category-menu" value="${category.id}">  
                                  <p style="color: #c00;" class="category-menu">このカテゴリを削除</p>  
                              </button>  
                            </li>  
                          </ul>  
                        </div>  
                      </div>  
                    </div>  
                    <div id="category-cards" class="category-cards" >  
                      ${
                        tasks?.length > 0
                          ? tasks
                              .filter((task) => task?.categoryIDs?.length && task?.categoryIDs[0] === category.id)
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
                    <div class="category-footer">  
                      <button value="${category.id}" class="add-task-button">タスク追加</button>  
                    </div>  
                  </div>  
                </div>  
              `
              )
              .join('\n ')
          : ''
      }  
      <div class="add-category-outer">  
        <div class="add-category">  
          <button id="add-category-button" class="add-category-button">  
            <span class="add-category-button-text">+ カテゴリーを追加</span>  
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
    const categories = (await getCategories()).sort((a, b) => a.order - b.order)

    const addCategoryButton = document.getElementById('add-category-button')
    addCategoryButton.addEventListener('click', (event) => {
      event.preventDefault()
      location.hash = `#/createCategory`
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
    //MEMO: close the category menu by touching screen
    window.ontouchstart = (event: TouchEvent) => {
      const menuContainers = document.querySelectorAll('.menu-container')
      menuContainers.forEach((menuContainer: HTMLDivElement) => {
        if ((event.target as HTMLElement).classList.contains('category-menu')) return
        menuContainer.style.display = 'none'
      })
    }
    clickRoutingButtonsObserver('add-task-button', 'createTask', true)
    clickRoutingButtonsObserver('delete-category-button', 'deleteCategory', true)
    clickRoutingButtonsObserver('edit-category-button', 'editCategory', true)

    useDnd('card-outer', 'category-outer', tasks, categories, 'categoryIDs', updateTask, updateCategory)
  },
})
