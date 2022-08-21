import axios from 'axios'
import { log } from '../base'

const SearchFetch = async (value) => {  
    const now = new Date().getTime()
    const searched_user = await axios.get(`/api/userView/?is_active=true&timestamp=${now}`)
    
    const searchedWords = value?.toLowerCase().split(' ')
    const rankResults = []

    searched_user.data.map(user => {
        let searchScore = 0

        
        searchedWords.map(value => {
            if (
                user.username.toLowerCase().includes(value)||
                user.email.toLowerCase().includes(value)||
                user.first_name.toLowerCase().includes(value)||
                user.last_name.toLowerCase().includes(value)
            ){
                searchScore += 1
            }
            
        })

        if (searchScore !== 0) {
            rankResults.push({userDetail: user, score: searchScore})
        }
    })

    const sliceSortResult = rankResults.slice(0, 100).sort((a, b) => b.score - a.score)
    
    return Object.keys(sliceSortResult).map(key => sliceSortResult[key].userDetail)
}
 
export default SearchFetch;