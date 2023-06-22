import './index.css'
import { getCategories } from '../../repositories/category'
import { getTasks } from '../../repositories/task'

export const HomePage = () => ({
  render: async () => {
    const tasks = (await getTasks()).sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
    const categories = (await getCategories()).sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())

    const view = /*html*/ `  
            <section class="home-task-section">  
              <div id="board">  
                  ${
                    categories?.length > 0
                      ? categories
                          .map(
                            (category) => /*html*/ `
                            <div class="category-outer"> 
                              <div class="category">
                                <div class="category-header">
                                  <h2>${category.title}</h2>
                                  <div class="icon-container">  
                                    <p class="three-dot-icon">･･･</p>
                                  <div class="menu-container">  
                                    <ul>
                                      <li value="${category.id}">
                                        <button class="delete-category-delete-button" value="${category.id}">
                                          <p style="color: #c00;">このカテゴリを削除</p>
                                        </button>
                                      </li>  
                                    </ul>  
                                  </div>
                              </div> 
                  
                                </div>
                                <div class="category-cards">  
                                  ${
                                    tasks?.length > 0
                                      ? tasks
                                          .filter((task) => task?.categoryIDs?.length && task?.categoryIDs[0] === category.id)
                                          ?.map(
                                            (task) => /*html*/ `
                                            <div class="card-outer">  
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
    const addTaskButtons = document.querySelectorAll('button.add-task-button')
    addTaskButtons.forEach((addTaskButton: HTMLButtonElement) =>
      addTaskButton.addEventListener('click', () => {
        location.hash = `#/createTask/${addTaskButton.value}`
      })
    )
    const addCategoryButton = document.getElementById('add-category-button')
    addCategoryButton.addEventListener('click', (event) => {
      event.preventDefault()
      location.hash = `#/createCategory`
    })

    const iconContainers = document.querySelectorAll('.icon-container')
    iconContainers.forEach((iconContainer: HTMLDivElement) => {
      iconContainer.addEventListener('click', () => {
        const childNode = iconContainer.children[1] as HTMLDivElement
        childNode.style.display = 'block'
      })
    })
    iconContainers.forEach((iconContainer: HTMLDivElement) => {
      iconContainer.addEventListener('mouseleave', () => {
        const childNode = iconContainer.children[1] as HTMLDivElement
        childNode.style.display = 'none'
      })
    })

    const deleteCategoryButtons = document.querySelectorAll('.delete-category-delete-button')
    deleteCategoryButtons.forEach((deleteCategoryButton: HTMLButtonElement) => {
      deleteCategoryButton.addEventListener('click', async (event) => {
        event.preventDefault()
        location.hash = `#/deleteCategory/${deleteCategoryButton.value}`
      })
    })
  },
})
