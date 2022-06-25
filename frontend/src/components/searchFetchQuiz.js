import axiosInstance from './axiosApi';
import { log, sortByNewest } from './base'

const SearchFetch = async (value) => {
    
    const searched_quiz = await axiosInstance.get(`/api/quiz/?public=true`)
    const searched_pointy = await axiosInstance.get(`/api/test/?public=true`)
    
    const concat = searched_quiz.data.concat(searched_pointy.data)
    const searchedValue = value?.toLowerCase().split(' ')
    const rankResults = []

    concat.map(quiz => {
        let quizScore = 0
        for (let word in searchedValue) {
            if (
                quiz.title.toLowerCase().includes(searchedValue[word])||
                quiz.subCategory.toLowerCase().includes(searchedValue[word])||
                quiz.tags.toLowerCase().includes(searchedValue[word])
            ){
                quizScore += 1
            }
        }

        if (quizScore !== 0) {
            rankResults.push({quizDetail: quiz, score: quizScore})
        }
    })

    const sliceSortResult = rankResults.slice(0, 100).sort((a, b) => b.score - a.score)

    return Object.keys(sliceSortResult).map(key => sliceSortResult[key].quizDetail)
}
 
export default SearchFetch;