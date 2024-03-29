import axios from 'axios';
import { log, getCookie } from './base'
import { setupCache } from 'axios-cache-adapter'
import rateLimit from 'axios-rate-limit';

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const cache = setupCache({
    maxAge: 15 * 60 * 1000,
    exclude: { query: false },
})

const axiosInstance = rateLimit(
    axios.create({
        timeout: 60000,  // 1min
        headers: {
            'Authorization': "JWT " + getCookie('USER_ACCESS_TOKEN'),
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },
        adapter: cache.adapter
    }),
    {maxRequests: 2, perMilliseconds: 1000, maxRPS: 2}
)

axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        const originalRequest = error.config;

        if (String(error).includes('timeout')) {
            log('network error')
        }

        if (error.response.status === 401 && (originalRequest.url === 'http://localhost:8000' +'/token/refresh/' || originalRequest.url === 'https://www.quizzland.net' +'/token/refresh/')) {
            log('logged from 1')    
            // window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response.data.code === "token_not_valid" &&
            error.response.status === 401 && 
            error.response.statusText === "Unauthorized") 
            {
                const refreshToken = getCookie('USER_REFRESH_TOKEN');

                if (refreshToken && !refreshToken.includes('undefined')) {
                    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                    const now = Math.ceil(Date.now() / 1000);

                    if (tokenParts.exp > now) {
                        return axiosInstance
                            .post('/api/token/refresh/', {refresh: refreshToken})
                                .then((res) => {
                                    document.cookie = `USER_ACCESS_TOKEN=${res.data.access}; path=/;`
                                    document.cookie = `USER_REFRESH_TOKEN=${res.data.refresh}; path=/;`
                    
                                    axiosInstance.defaults.headers['Authorization'] = "JWT " + res.data.access;
                                    originalRequest.headers['Authorization'] = "JWT " + res.data.access;
                    
                                    return axiosInstance(originalRequest);
                                })
                                .catch(err => {
                                    document.cookie = `USER_ACCESS_TOKEN=; path=/;`
                                    document.cookie = `USER_REFRESH_TOKEN=; path=/;`
                                    
                                    log('logged from 2')
                                    window.location.reload()
                                    // window.location.href = '/login';
                                });
                    }else{
                        log('logged from 3')
                        window.location.reload()
                        // window.location.href = '/login';
                    }
                }
        }
      
     
      return Promise.reject(error);
  }
);
export default axiosInstance