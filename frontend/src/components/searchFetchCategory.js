import axiosInstance from './axiosApi';
import { log, sortByNewest } from './base'

const SearchFetch = async (value) => {
    const searched_category = await axiosInstance.get(`/api/subcategory/?public=true`)

    const searchedValue = value?.toLowerCase().split(' ')
    const rankResults = []

    searched_category.data.map(category => {
        let categoryScore = 0
        for (let word in searchedValue) {
            if (
                category.title.toLowerCase().includes(searchedValue[word])||
                category.subCategory.toLowerCase().includes(searchedValue[word])
            ){
                categoryScore += 1
            }
        }

        if (categoryScore !== 0) {
            rankResults.push({categoryDetail: category, score: categoryScore})
        }
    })

    const sliceSortResult = rankResults.slice(0, 4).sort((a, b) => b.score - a.score)

    return Object.keys(sliceSortResult).map(key => sliceSortResult[key].categoryDetail)
}
 
export default SearchFetch;