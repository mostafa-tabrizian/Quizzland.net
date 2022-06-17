import axios from 'axios'
import { log } from './base'

const accessToken = async () => {
    if (localStorage.getItem('access_token') && localStorage.getItem('refresh_token') && localStorage.getItem('username') !== null) {
        return
    }
    
    const adminDetail = {
        username: process.env.ADMINUSERNAME,
        password: process.env.ADMINPASSWORD,
    }

    await axios.post('/api/token/obtain/', adminDetail)
        .then((req) => {
            localStorage.setItem('username', null)
            localStorage.setItem('access_token', req.data.access)
            localStorage.setItem('refresh_token', req.data.refresh)
            localStorage.setItem('pass_token', null)
        })
        .catch((err) => {
            log(err)
        })
}

accessToken()

const axiosInstance = axios.create({
    timeout: 5000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && originalRequest.url === 'http://localhost:8000' +'/token/refresh/') {
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response.data.code === "token_not_valid" &&
            error.response.status === 401 && 
            error.response.statusText === "Unauthorized") 
            {
                const refreshToken = localStorage.getItem('refresh_token');

                if (refreshToken) {
                    const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                    const now = Math.ceil(Date.now() / 1000);

                    if (tokenParts.exp > now) {
                        return axiosInstance
                            .post('/api/token/refresh/', {refresh: refreshToken})
                                .then((response) => {
                    
                                    localStorage.setItem('access_token', response.data.access);
                                    localStorage.setItem('refresh_token', response.data.refresh);
                    
                                    axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                                    originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                    
                                    return axiosInstance(originalRequest);
                                })
                                .catch(err => {
                                    localStorage.removeItem('access_token')
                                    localStorage.removeItem('refresh_token')
                                    window.location.href = '/login';
                                });
                    }else{
                        window.location.href = '/login';
                    }
                }else{
                    window.location.href = '/login';
                }
        }
      
     
      return Promise.reject(error);
  }
);
export default axiosInstance