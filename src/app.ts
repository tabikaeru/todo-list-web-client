import '~/styles/reset.css'
import '~/styles/index.css'
import { useRouter } from '~/routes'
import { initializeDB } from '~/lib/indexedDB'

const app = () => {
  initializeDB()
  useRouter()
}

app()
