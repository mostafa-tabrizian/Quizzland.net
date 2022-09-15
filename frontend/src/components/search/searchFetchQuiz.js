import axios from '../axiosApi';
import { log } from '../base'
import ExcludeWordsToSearch from '../excludeWordsToSearch';

const SearchFetch = async (value) => {  
    const searched_quiz = await axios.get(`/api/quizView/?public=true`)
    const searched_pointy = await axios.get(`/api/testView/?public=true`)
    
    const concat = searched_quiz.data.concat(searched_pointy.data)
    const searchedValue = value?.toLowerCase().split(' ')
    const rankResults = []

    let filteredSearchValue = []

    searchedValue?.map(value => {
        if (!ExcludeWordsToSearch().includes(value.toLowerCase())) {
            filteredSearchValue.push(value)
        }
    })

    concat.map(quiz => {
        let quizScore = 0

        filteredSearchValue.map(value => {
            if (
                quiz.title.toLowerCase().split(' ').includes(value)||
                quiz.slug.toLowerCase().split(' ').includes(value)||
                quiz.subCategory.toLowerCase().split(' ').includes(value)||
                quiz.tags.toLowerCase().split(' ').includes(value)
            ){
                quizScore += 1
            }
            
        })

        if (quizScore !== 0) {
            rankResults.push({quizDetail: quiz, score: quizScore})
        }
    })

    const sliceSortResult = rankResults.slice(0, 100).sort((a, b) => b.score - a.score)
    
    return Object.keys(sliceSortResult).map(key => sliceSortResult[key].quizDetail)
}
 
export default SearchFetch;