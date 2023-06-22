import { HomePage } from '~/features/todos'
import { Error404Page } from '~/features/error'
import { CreateTaskPage, EditTaskPage, CreateCategoryPage, DeleteCategoryPage, EditCategoryPage } from '~/features/todos'
import { Navbar } from '~/components/Navbar'
import { Bottombar } from '~/components/Bottombar'
import { Formatter } from '~/utils/format.js'

const routes = {
  '/': HomePage,
  '/createTask/:id': CreateTaskPage,
  '/editTask/:id': EditTaskPage,
  '/createCategory': CreateCategoryPage,
  '/deleteCategory/:id': DeleteCategoryPage,
  '/editCategory/:id': EditCategoryPage,
}

export const useRouter = () => {
  const routerHandler = async () => {
    const header = null || document.getElementById('header_container')
    const content = null || document.getElementById('page_container')
    const footer = null || document.getElementById('footer_container')

    header.innerHTML = await Navbar().render()
    await Navbar().afterRender()

    footer.innerHTML = await Bottombar().render()
    await Bottombar().afterRender()

    const request = Formatter.parseRequestURL()

    const parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

    const page = routes[parsedURL] ? routes[parsedURL] : Error404Page
    content.innerHTML = await page().render()
    await page().afterRender()
  }

  window.addEventListener('hashchange', routerHandler)
  window.addEventListener('load', routerHandler)
}

export const refreshPage = async () => {
  const content = null || document.getElementById('page_container')

  const request = Formatter.parseRequestURL()

  const parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

  const page = routes[parsedURL] ? routes[parsedURL] : Error404Page
  content.innerHTML = await page().render()
  await page().afterRender()
}
