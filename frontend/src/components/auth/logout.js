import axios from '../axiosApi'
import { log } from "../base"

const Logout = async (refreshToken, removeCookie) => {
    try {
        await axios.post('/api/blacklist/', {"refresh_token": refreshToken})
            .catch(err => {
                log('err:logout')
                log(err)
                log(err.response)
            })

        removeCookie('USER_ACCESS_TOKEN', {path: '/'})
        removeCookie('USER_REFRESH_TOKEN', {path: '/'})
        axios.defaults.headers['Authorization'] = null;  
        window.location.reload()
    } catch (e) {
        log('logout error:')
        log(e)
    }
}
 
export default Logout;