import React, {useEffect, useState} from 'react';
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { Helmet } from "react-helmet";

import QuizContainer from './quizContainer';
import { log, takeParameterFromUrl, replaceFunction } from './base'
import PageTravel from './pageTravel';
import Header from './hotHeader';
import SkeletonLoading from './skeletonLoading'

const SearchMoreResult = () => {
    const [pageTravel, setPageTravel] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(8)
    const [offset, setOffset] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [searchValueButWithoutHyphen, setSearchValueButWithoutHyphen] = useState()
    const [matchedQuizzesCounter, setMatchedQuizzesCounter] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        searchChangeDetector()
    })

    useEffect(() => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
    }, [])

    useEffect(() => {
        getQuizzes()
        setSearchValueButWithoutHyphen(replaceFunction(searchValue, '+', ' '))
    }, [searchValue, offset])

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 15, perMilliseconds: 1000, maxRPS: 150 })

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
        if (searchValue !== '') {
            let matchedQuizzes = []

            // Search Quiz
            const search_new_quiz_title = await axiosLimited.get(`/dbAPI/new_quiz/?title__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_quiz_title.data.results)
            
            const search_new_quiz_subCategory = await axiosLimited.get(`/dbAPI/new_quiz/?subCategory__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_quiz_subCategory.data.results)
    
            const search_new_quiz_tag = await axiosLimited.get(`/dbAPI/new_quiz/?tags__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_quiz_tag.data.results)

            // Search Pointy Quiz
            const search_new_pointy_quiz_title = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?title__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_title.data.results)

            const search_new_pointy_quiz_subCategory = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?subCategory__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_subCategory.data.results)

            const search_new_pointy_quiz_tag = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?tags__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_pointy_quiz_tag.data.results)

            // Remove duplicated quizzes
            let uniqueMatchedQuizzes = {};

            for ( let i = 0; i < matchedQuizzes.length; i++ )
                uniqueMatchedQuizzes[matchedQuizzes[i]['title']] = matchedQuizzes[i];

            matchedQuizzes = new Array();
            for ( let key in uniqueMatchedQuizzes )
                matchedQuizzes.push(uniqueMatchedQuizzes[key]);
            
            setPageTravel(search_new_quiz_title.data)
    
            const quizzesList = () => {
                return (
                    <QuizContainer quizzes={matchedQuizzes}/>
                )
            }
                
            setMatchedQuizzesCounter(matchedQuizzes.length)
            setQuizzesList([])
            setQuizzesList(quizzesList)
        }

        else {
            setMatchedQuizzesCounter(0)
        }

        setContentLoaded(true)
    }

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>{`کوییزلند | ${searchValueButWithoutHyphen} جستجو عبارت `}</title>
                <meta name="description" content="صفحه جستجو کوییزلند" />
                <meta name="keywords" content="جستجو, کوییز, کوییزلند" />
                <meta name="robots" content="noindex, follow"></meta>
            </Helmet>

            <div className='flex flex-jc-c flex-ai-c'>
                ‌<h3 className='title'> ‌ <span style={{fontSize: '1rem'}}>عبارت جستجو شده : <br/></span> {searchValueButWithoutHyphen}</h3>‌
            </div>‌‌

            {
                matchedQuizzesCounter ? 
                <ul className='quizContainer flex wrapper-med'>
                    {quizzesList}
                </ul>
                :
                SkeletonLoading(contentLoaded)
            }

            <PageTravel
                pageTravel={pageTravel} setPageTravel={setPageTravel}
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                offset={offset} setOffset={setOffset}
            />

        </React.Fragment>
    );
}
 
export default SearchMoreResult;