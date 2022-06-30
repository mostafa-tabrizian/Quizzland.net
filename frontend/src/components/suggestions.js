import React, { useState, useEffect } from 'react'

import axiosInstance from '../components/axiosApi';
import userProfileDetail from '../components/user/userProfileDetail';
import { log, sortByMonthlyViews } from '../components/base'
import QuizContainer from '../components/quizContainer';

const Suggestions = () => {
    const [suggestionQuizzes, setSuggestionQuizzes] = useState([])
    
    useEffect( async () => {
        const userDetail = await userProfileDetail()
        await fetchData(userDetail)
    }, []);
    
    const fetchData = async (userDetail) => {
        const quiz = await axiosInstance.get('/api/quiz/?public=true')
        const pointy = await axiosInstance.get('/api/test/?public=true')
        
        await returnSuggestions(quiz.data, pointy.data, userDetail)
    }

    const getUserPreviousLiked = async (userDetail) => {
        const now = new Date().getTime()
        let userPreviousLiked
        
        await axiosInstance.get(`/api/user/?username=${userDetail.username}&timestamp=${now}`)
            .then(res => {
                userPreviousLiked = res.data[0].liked_quizzes.split('_')
                userPreviousLiked = userPreviousLiked.concat(res.data[0].played_history.split('_'))
                userPreviousLiked = userPreviousLiked.concat(res.data[0].watch_list.split('_'))
            })

        return userPreviousLiked
    }

    const getUserPreviousLikedId = (userPreviousLiked) => {
        let userPreviousLikedId = []
        
        userPreviousLiked.map(previousQuiz => {
            userPreviousLikedId.push(previousQuiz.slice(0, -1))
        })

        return userPreviousLikedId
    }

    const userPreviousLikedSubCategory = async (quiz, pointy, userPreviousLiked) => {
        let previousUserSubCategory = []
        
        userPreviousLiked.map(quizId => {
            if (quizId && quizId != 0) {
                
                let quizDetail
                
                if (quizId.includes('q')) {
                    quizDetail = quiz.filter(elem => elem.id == parseInt(quizId)).slice(-10)
                }
                else if (quizId.includes('t')) {
                    quizDetail = pointy.filter(elem => elem.id == parseInt(quizId)).slice(-10)
                }
                
                if (!previousUserSubCategory.includes(quizDetail[0]?.subCategory)) { previousUserSubCategory.push(quizDetail[0]?.subCategory) }
            }
        })

        return previousUserSubCategory
    }

    const grabAndSortMostVisitedCategories = (interest) => {
        if (interest !== null) {
            let hightestVisitedCategory = [];

            for (let category in interest) {
                hightestVisitedCategory.push([category, interest[category]]);
            }

            hightestVisitedCategory.sort(function (a, b) {
                return b[1] - a[1];
            });

            return hightestVisitedCategory
        }
    }
    
    const returnSuggestions = async (quiz, pointy, userDetail) => {
        const content = quiz.concat(pointy)
        let finalList = []
        
        if (userDetail != null) {
            const userPreviousLiked = await getUserPreviousLiked(userDetail)
            const userPreviousLikedId = getUserPreviousLikedId(userPreviousLiked)
            const previousUserSubCategory = await userPreviousLikedSubCategory(quiz, pointy, userPreviousLiked)
            
            content.map(quiz => {
                if (previousUserSubCategory.includes(quiz.subCategory) && !userPreviousLikedId.includes(String(quiz.id))) {
                    finalList.push(quiz)
                }
            })
            
        } else {
            const interest = JSON.parse(localStorage.getItem('interest'))['categoryWatchedCounter']
            const hightestVisitedCategory = grabAndSortMostVisitedCategories(interest)

            if (hightestVisitedCategory.length < 3) { return }
            
            const top1stUserCategory = hightestVisitedCategory[0][0]
            const top2ndUserCategory = hightestVisitedCategory[1][0]
            const top3rdUserCategory = hightestVisitedCategory[2][0]
    
            const top1stSubCategory = content.filter(quiz => quiz.subCategory == top1stUserCategory)
            const top2stSubCategory = content.filter(quiz => quiz.subCategory == top2ndUserCategory)
            const top3stSubCategory = content.filter(quiz => quiz.subCategory == top3rdUserCategory)
            
            finalList = top1stSubCategory.concat(top2stSubCategory).concat(top3stSubCategory)
        }

        setSuggestionQuizzes(finalList.sort(sortByMonthlyViews).slice(0, 16))
    }


    return (
        suggestionQuizzes.length != 0 &&
        <div className="mb-8 mt-[5rem]">

            <div className="mb-8 quizContainer__header">
                <h2 className=''>پیشنهادی های کوییزلند به شما</h2>
            </div>

            <div>
                <ul className="flex flex-wrap align-baseline">
                    <QuizContainer quizzes={suggestionQuizzes} bgStyle='trans' />
                </ul>
            </div>
        </div>
    )
}
 
export default Suggestions;