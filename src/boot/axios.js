import { boot } from "quasar/wrappers";
import axios from "axios";

const api = axios.create({ baseURL: "https://rec-algo.carlotti-toussaint.com"});

api.interceptors.response.use(
  response => (response),
  error => (Promise.reject(error.response.data.err))
)

export default boot(({ app }) => {

  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = api;
});

export { api, axios };
