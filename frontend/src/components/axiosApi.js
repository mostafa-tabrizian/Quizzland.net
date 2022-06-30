import axios from 'axios'
import { log } from './base'

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

const accessToken = async () => {
    if (sessionStorage.getItem('access_token') && sessionStorage.getItem('refresh_token')) {
        return
    }
    
    const adminDetail = {
        username: process.env.GUESTUSERNAME,
        password: process.env.GUESTPASSWORD,
    }

    await axios.post('/api/token/obtain/', adminDetail)
        .then((req) => {
            sessionStorage.setItem('access_token', req.data.access)
            sessionStorage.setItem('refresh_token', req.data.refresh)
        })
        .catch((err) => {
            // log(err.response)
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

        if (error.response.status === 401 && originalRequest.url === 'http://localhost:8000' +'/token/refresh/') {
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