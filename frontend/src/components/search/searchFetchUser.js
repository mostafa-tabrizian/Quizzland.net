import axiosInstance from '../axiosApi';
import { log } from '../base'

const SearchFetch = async (value) => {  
    const searched_user = await axiosInstance.get(`/api/user/`)
    
    const searchedWords = value?.toLowerCase().split(' ')
    const rankResults = []

    searched_user.data.map(user => {
        let searchScore = 0

        
        searchedWords.map(value => {
            if (
                user.username.toLowerCase().includes(value)||
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
    
    log(Object.keys(sliceSortResult).map(key => sliceSortResult[key].userDetail))
    return Object.keys(sliceSortResult).map(key => sliceSortResult[key].userDetail)
}
 
export default SearchFetch;