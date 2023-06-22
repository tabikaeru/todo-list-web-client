import '~/styles/reset.css'
import '~/styles/index.css'
import { router } from '~/routes'
import { initializeDB } from '~/lib/indexedDB'

const app = () => {
  initializeDB()
  router()
}

app()
