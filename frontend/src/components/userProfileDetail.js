import axiosInstance from '../components/axiosApi'
import { log } from '../components/base'

const userProfileDetail = async () => {
    const now = new Date().getTime()
    const username = localStorage.getItem('username')
    const localAccessToken = localStorage.getItem('access_token')
    const localRefreshToken = localStorage.getItem('refresh_token')
    const localPassToken = localStorage.getItem('pass_token')
    
    if (username !== null  && localPassToken && localAccessToken && localAccessToken.length == 228) {
        return await axiosInstance.get(`/api/user/?username=${username}&timestamp=${now}`)
            .then( async res => {
                if (res.data.length == 0) {
                    return null
                } else {
                    const user = res.data[0]
    
                    if (localPassToken == user.pass_token) {
                        return await axiosInstance.post('/api/token/refresh/', {refresh: localRefreshToken})
                            .then(res => {
                                localStorage.setItem('refresh_token', res.data.refresh);
                                return user
                            })
                    } else {
                        window.location.href = '/login'
                    }
                }
            })
            .catch(err => {
                if (String(err).includes("reading 'pass_token'")) {
                    localStorage.setItem('username', null)
                }
            })
    } else {
        return null
    }
}
 
export default userProfileDetail;