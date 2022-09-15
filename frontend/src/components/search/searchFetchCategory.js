import axios from '../axiosApi';
import { log } from '../base'
import ExcludeWordsToSearch from '../excludeWordsToSearch';

const SearchFetch = async (value) => {
    const searched_category = await axios.get(`/api/subcategoryView/?public=true`)

    const searchedValue = value?.toLowerCase().split(' ')
    const rankResults = []

    let filteredSearchValue = []

    searchedValue?.map(value => {
        if (!ExcludeWordsToSearch().includes(value.toLowerCase())) {
            filteredSearchValue.push(value)
        }
    })

    searched_category.data.map(category => {
        let categoryScore = 0

        filteredSearchValue.map(value => {
            if (
                category.title.toLowerCase().includes(value)||
                category.subCategory.toLowerCase().includes(value)
            ){
                categoryScore += 1
            }
        })

        if (categoryScore !== 0) {
            rankResults.push({categoryDetail: category, score: categoryScore})
        }
    })

    const sliceSortResult = rankResults.slice(0, 4).sort((a, b) => b.score - a.score)

    return Object.keys(sliceSortResult).map(key => sliceSortResult[key].categoryDetail)
}
 
export default SearchFetch;