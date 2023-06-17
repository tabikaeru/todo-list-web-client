import { Home } from '~/features/todos'
import { Error404 } from '~/features/error'
import { Navbar } from '~/components/Navbar'
import { Bottombar } from '~/components/Bottombar'
import { Formatter } from '~/utils/format.js'

const routes = {
  '/': Home,
}

export const router = () => {
  const routerHandler = async () => {
    const header = null || document.getElementById('header_container')
    const content = null || document.getElementById('page_container')
    const footer = null || document.getElementById('footer_container')

    header.innerHTML = await Navbar.render()
    await Navbar.afterRender()

    footer.innerHTML = await Bottombar.render()
    await Bottombar.afterRender()

    const request = Formatter.parseRequestURL()

    const parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')

    const page = routes[parsedURL] ? routes[parsedURL] : Error404
    content.innerHTML = await page.render()
    await page.afterRender()
  }

  window.addEventListener('hashchange', routerHandler)
  window.addEventListener('load', routerHandler)
}
