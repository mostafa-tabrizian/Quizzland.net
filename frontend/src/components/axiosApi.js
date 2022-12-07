import axios from 'axios';
import { setupCache } from 'axios-cache-adapter'
import rateLimit from 'axios-rate-limit';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    exclude: { query: false },
})

const api = rateLimit(
    axios.create({
        adapter: cache.adapter
    }), { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 }
)

export default api