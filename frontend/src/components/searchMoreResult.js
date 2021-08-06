import React, {useEffect, useState} from 'react';
import axios from 'axios'

import Header from './header';
import QuizContainer from './quizContainer';
import { log, takeParameterFromUrl, replaceFunction } from './base'
import PageTravel from './pageTravel';

const SearchMoreResult = () => {
    const [pageTravel, setPageTravel] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [searchValue, setSearchValue] = useState()
    const [matchedQuizzesCounter, setMatchedQuizzesCounter] = useState()

    useEffect(() => {
        searchChangeDetector()
    })

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
        setSearchValue(replaceFunction(takeParameterFromUrl('s'), ' ', '+'))
    }, [])

    useEffect(() => {
        getQuizzes()
    }, [searchValue])

    const searchChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            setSearchValue(replaceFunction(takeParameterFromUrl('s'), ' ', '+'))

        })(window.history);
    }

    const getQuizzes = async () => {
        let matchedQuizzes = []
        
        const search_new_quiz_title = await axios.get(`/dbQuizzland$M19931506/new_quiz/?title__icontains=${searchValue}&limit=16&offset=${offset}`)
        Array.prototype.push.apply(matchedQuizzes, search_new_quiz_title.data.results)
        
        const search_new_quiz_subCategory = await axios.get(`/dbQuizzland$M19931506/new_quiz/?subCategory__icontains=${searchValue}&limit=16&offset=${offset}`)
        Array.prototype.push.apply(matchedQuizzes, search_new_quiz_subCategory.data.results)
        
        const quizzesList = () => {
            return (
                <QuizContainer quizzes={matchedQuizzes}/>
                )
            }
            
        setMatchedQuizzesCounter(matchedQuizzes.length)
        setQuizzesList([])
        setQuizzesList(quizzesList)
    }

    return (
        <React.Fragment>
            <Header
                title={`کوییزلند | ${searchValue} جستجو عبارت `}
            />
            <div className='flex flex-jc-c flex-ai-c'>
                ‌<span > ‌تعداد نتایج :‌ {matchedQuizzesCounter} </span>‌‌
                ‌<h3 className='title'> ‌ عبارت جستجو شده : {searchValue}</h3>‌
            </div>

            <ul className='quizContainer flex flex-jc-fe flex-ai-c wrapper-med'>
                {quizzesList}
            </ul>

            <PageTravel
                pageTravel={pageTravel} setPageTravel={setPageTravel}
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                offset={offset} setOffset={setOffset}
            />

        </React.Fragment>
    );
}
 
export default SearchMoreResult;