import axios from 'axios';
import { setupCache } from 'axios-cache-adapter'

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    exclude: { query: false },
})

const api = axios.create({
    adapter: cache.adapter
})

export default api