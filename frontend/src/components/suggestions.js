import React, { useState, useEffect } from 'react'
import axios from '../components/axiosApi';
import UserStore from '../store/userStore';
import axiosInstance from './axiosAuthApi'
import { log, sortByMonthlyViews } from '../components/base'
import QuizContainer from '../components/quizContainer';

const Suggestions = () => {
    const [suggestionQuizzes, setSuggestionQuizzes] = useState([])
    
    const [userProfile, userActions] = UserStore()

    useEffect( async () => {
        await fetchData()
    }, [userProfile]);
    
    const fetchData = async () => {
        await getSuggestions()
    }

    // const fetchUserLike = async () => {
    //     const now = new Date().getTime()
        
    //     return await axiosInstance.get(`/api/likeView/?timestamp=${now}`)
    //         .then(res => {
    //             return res.data
    //         })
    //         .catch(err => {
    //             return log(err.response)
    //         })
    // }

    const fetchUserHistory = async () => {
        const now = new Date().getTime()

        return await axiosInstance.get(`/api/historyView/?timestamp=${now}`)
            .then(res => {
                return res.data
            })
            .catch(err => {
                return log(err.response)
            })
    }

    // const grabAndSortMostVisitedCategories = (interest) => {
    //     if (interest !== null) {
    //         let hightestVisitedCategory = [];

    //         for (let category in interest) {
    //             hightestVisitedCategory.push([category, interest[category]]);
    //         }

    //         hightestVisitedCategory.sort(function (a, b) {
    //             return b[1] - a[1];
    //         });

    //         return hightestVisitedCategory
    //     }
    // }

    const countCategoriesUserPlayed = (userLike) => {
        let likeQuizCategory = {}

        for (let quiz in userLike) {
            const likeQuizCategoryKeys = Object.keys(likeQuizCategory)
            quiz = userLike[quiz]
            let quizSubCategory
            
            if (quiz.trivia_id != null) {
                quizSubCategory = quiz.trivia_id.subCategory
            } else if (quiz.test_id != null) {
                quizSubCategory = quiz.test_id.subCategory
            }
            
            if (likeQuizCategoryKeys.includes(quizSubCategory)) {
                likeQuizCategory[quizSubCategory] += 1
            } else {
                likeQuizCategory[quizSubCategory] = 1
            }
        }

        return likeQuizCategory
    }

    const sortCategoryUserPlayed = (likeQuizCategory) => {
        if (likeQuizCategory !== null) {
            let sortedList = [];
            for (let quizObject in likeQuizCategory) {
                sortedList.push([quizObject, likeQuizCategory[quizObject]]);
            }

            sortedList.sort(function(a, b) {
                return a[1] - b[1];
            });

            sortedList.reverse()

            return sortedList
        }
    }

    const sliceTopThreeUserCategory = (sortedList) => {
        const categoryList = []
        let categoryCounter = 0
        
        for (let category in sortedList) {
            categoryList.push(sortedList[category][0])
            categoryCounter++
            if (categoryCounter == 3) {
                break
            }
        }
        
        return categoryList
    }

    const getQuizByUserChosenCategories = (content, categoryList) => {
        let finalList = []
        let quizCounter = 0
        
        for (let quiz in content) {
            quiz = content[quiz]
            if (categoryList.includes(quiz.subCategory)) {  //  && !userLikeId.includes(String(quiz.id))
                finalList.push(quiz)
                quizCounter++
                if (quizCounter == 20) {
                    break
                }
            }
        }

        finalList.sort(sortByMonthlyViews).slice(0, 16)
        
        return finalList
    }
    
    const getSuggestions = async () => {
        const quiz = await axios.get('/api/quizView/?public=true')
        const pointy = await axios.get('/api/testView/?public=true')
        
        const content = (quiz.data).concat(pointy.data)
        let suggestionQuizzes = []

        if (userProfile.userDetail !== null && userProfile.userDetail) {
            // const userLike = await fetchUserLike()
            const userHistory = await fetchUserHistory()

            const categoriesUserPlayed = countCategoriesUserPlayed(userHistory)

            const categoryUserPlayedSorted = sortCategoryUserPlayed(categoriesUserPlayed)

            const topThreeUserCategory = sliceTopThreeUserCategory(categoryUserPlayedSorted)

            suggestionQuizzes = getQuizByUserChosenCategories(content, topThreeUserCategory)
        }
        else {
            const interest = JSON.parse(localStorage.getItem('interest'))['categoryWatchedCounter']
            const hightestVisitedCategory = sortCategoryUserPlayed(interest)

            if (hightestVisitedCategory.length < 3) { return }

            const top1stUserCategory = hightestVisitedCategory[0][0]
            const top2ndUserCategory = hightestVisitedCategory[1][0]
            const top3rdUserCategory = hightestVisitedCategory[2][0]

            const topThreeUserCategory = [top1stUserCategory, top2ndUserCategory, top3rdUserCategory]
            
            suggestionQuizzes = getQuizByUserChosenCategories(content, topThreeUserCategory)
        }

        setSuggestionQuizzes(suggestionQuizzes)
    }


    return (
        suggestionQuizzes.length != 0 &&
        <div className="mb-8 mt-[5rem]">

            <div className="mb-8 quizContainer__header">
                <h2 className=''>پیشنهادی های کوییزلند به شما</h2>
            </div>

            <div>
                <ul className="flex flex-col flex-wrap align-baseline md:flex-row">
                    <QuizContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                </ul>
            </div>
        </div>
    )
}
 
export default Suggestions;