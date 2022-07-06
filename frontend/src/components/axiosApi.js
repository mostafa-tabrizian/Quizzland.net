import { message } from 'antd';
import axios from 'axios'
import { log } from './base'

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const accessToken = async () => {
    if (sessionStorage.getItem('access_token') && sessionStorage.getItem('refresh_token')) {
        return
    }
    
    const adminDetail = {
        username: process.env.GUEST_USERNAME,
        password: process.env.GUEST_PASSWORD,
    }

    await axios.post('/api/token/obtain/', adminDetail)
        .then((res) => {
            sessionStorage.setItem('access_token', res.data.access)
            sessionStorage.setItem('refresh_token', res.data.refresh)
        })
        .catch((err) => {
            log(err.response)
        })
}

accessToken()

const axiosInstance = axios.create({
    timeout: 5000,
    headers: {
        'Authorization': "JWT " + sessionStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (String(error).includes('timeout ')) {
            message.error('لطفا اتصال اینترنت خود را بررسی کنید!')
        }

        if (error.response.status === 401 && originalRequest.url === 'http://localhost:8000' +'/token/refresh/') {
            log('logged from 1')    
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response.data.code === "token_not_valid" &&
            error.response.status === 401 && 
            error.response.statusText === "Unauthorized") 
            {
                const refreshToken = sessionStorage.getItem('refresh_token');

                if (refreshToken) {
                    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                    const now = Math.ceil(Date.now() / 1000);

                    if (tokenParts.exp > now) {
                        return axiosInstance
                            .post('/api/token/refresh/', {refresh: refreshToken})
                                .then((response) => {
                    
                                    sessionStorage.setItem('access_token', response.data.access);
                                    sessionStorage.setItem('refresh_token', response.data.refresh);
                    
                                    axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                                    originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                    
                                    return axiosInstance(originalRequest);
                                })
                                .catch(err => {
                                    sessionStorage.removeItem('access_token')
                                    sessionStorage.removeItem('refresh_token')
                                    log('logged from 2')
                                    window.location.href = '/login';
                                });
                    }else{
                        log('logged from 3')
                        window.location.href = '/login';
                    }
                }else{
                    log('logged from 4')
                    window.location.href = '/login';
                }
        }
      
     
      return Promise.reject(error);
  }
);
export default axiosInstance