import axios from 'axios'
import { log } from '../base'

const SearchFetch = async (value) => {  
    const now = new Date().getTime()

    return await axios.post(`/api/search_user?timestamp=${now}`, {'username': value})
        .then( async res => {
            let userReadyList = []

            res.data.map(user => {
                userReadyList.push(user.fields)
            })

            return userReadyList
        }) 
}
 
export default SearchFetch;