import axiosInstance from '../axiosApi'
import { log } from '../base'

const userProfileDetail = async () => {
    
    const refreshToken = async () => {
        const localRefreshToken = sessionStorage.getItem('refresh_token')
        return await axiosInstance.post('/api/token/refresh/', {refresh: localRefreshToken})
            .then(res => {
                sessionStorage.setItem('access_token', res.data.access);
                sessionStorage.setItem('refresh_token', res.data.refresh);
            })
            .catch(err => {
                // log(err.response)
            })
    }

    const fetchUserProfile = async () => {
        const localAccessToken = sessionStorage.getItem('access_token')
        return await axiosInstance.get(`/api/login?at=${localAccessToken}`)
            .then (res => {
                if (res.data.username !== 'guest') {
                    return res.data
                }
            })
            .catch(err => {
                // log(err.response)
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
 

export default userProfileDetail;