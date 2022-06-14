import axiosInstance from '../components/axiosApi'
import { log } from '../components/base'

const userProfileDetail = async () => {
    const now = new Date().getTime()
    const username = localStorage.getItem('username')
    const localAccessToken = localStorage.getItem('access_token')
    const localRefreshToken = localStorage.getItem('refresh_token')
    const localPassToken = localStorage.getItem('pass_token')
    
    if (username !== 'default' && localAccessToken && localAccessToken.length == 228 && localPassToken) {
        return await axiosInstance.get(`/api/user/?username=${username}&timestamp=${now}`)
            .then( async res => {
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

            })
    } else {
        return null
    }
}
 
export default userProfileDetail;