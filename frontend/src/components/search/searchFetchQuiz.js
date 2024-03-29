import axios from '../axiosApi';
import { log } from '../base'
import ExcludeWordsToSearch from '../excludeWordsToSearch';

const SearchFetchQuiz = async (value) => {  
    const searched_quiz = await axios.get(`/api/quizV2View/?public=true`)
    const searchedValue = value?.toLowerCase().split(' ')
    const rankResults = []

    let filteredSearchValue = []

    searchedValue?.map(value => {
        if (!ExcludeWordsToSearch().includes(value.toLowerCase())) {
            filteredSearchValue.push(value)
        }
    })

    searched_quiz.data.map(quiz => {
        let quizScore = 0

        filteredSearchValue.map(value => {
            if (
                quiz.title.toLowerCase().split(' ').includes(value)||
                quiz.slug.toLowerCase().split(' ').includes(value)||
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
 
export default SearchFetchQuiz;