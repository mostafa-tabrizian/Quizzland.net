import axiosInstance from '../axiosAuthApi'
import { log, getCookie } from '../base'

const UserProfileDetail = () => {
    const refreshToken = async () => {
        const localRefreshToken = getCookie('USER_REFRESH_TOKEN')
            
        return (
            localRefreshToken &&
            await axiosInstance.post('/api/token/refresh/', {refresh: localRefreshToken})
                .then(res => {
                    document.cookie = `USER_ACCESS_TOKEN=${res.data.access}; path=/;`
                    document.cookie = `USER_REFRESH_TOKEN=${res.data.refresh}; path=/;`
                    
                    window.location.reload()
                })
                .catch(err => {
                    log('refresh error')
                    log(err.response)
                })
        )
    }

    const fetchUserProfile = async () => {
        const localAccessToken = getCookie('USER_ACCESS_TOKEN')
        const now = new Date().getTime()

        if (localAccessToken) {
            return await axiosInstance.get(`/api/userView/?timestamp=${now}`)
                .then (res => {
                    const user = res.data[0]
                    if (user.is_active) {
                        return user
                    } else {
                        return 'inactive'
                    }
                })
                .catch(err => {
                    if (err.response.data.detail.includes('inactive')) {
                        return 'inactive'
                } else {
                    log('api login')
                    log(err)
                    log(err.response)
                    refreshToken()
                }
            })
        } else {
            return false
        }
    }

    return fetchUserProfile()
}
 
export default UserProfileDetail;