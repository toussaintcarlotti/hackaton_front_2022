import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://127.0.0.1:8000' })

const omdbapi = axios.create({ baseURL: 'https://www.omdbapi.com' })

omdbapi.interceptors.request.use(
  config => {
    config.params = {'apikey': 'e173217c'}
    return config;
  }
)

export default boot(({ app }) => {

  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$api = api
})

export { api, axios, omdbapi }
