import axiosInstance from '../axiosApi'
import { log, getCookie } from '../base'

const UserProfileDetail = async () => {

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
                    log(err.response)
                })
        )
    }

    const fetchUserProfile = async () => {
        const localAccessToken = getCookie('USER_ACCESS_TOKEN')
        const now = new Date().getTime()

        return await axiosInstance.get(`/api/login?at=${localAccessToken}&timestamp=${now}`)
            .then (res => {
                if (res.data.username !== 'guest') {
                    return res.data
                }
            })
            .catch(err => {
                log(err.response)
                refreshToken()
            })
    }

    // const fetchUserProfileUpdate = async (at) => {
    //     return await axiosInstance.get(`/api/login?at=${at}`)
    //         .then (res => {
    //             log('return profile 2')
    //             log(res.data)
    //             return res.data
    //         })
    //         .catch(err => {
    //             log(err)
    //             log(err.response)
    //             log('refresh again!!!!!')
    //         })
    // }

    return await fetchUserProfile()
}
 

export default UserProfileDetail;