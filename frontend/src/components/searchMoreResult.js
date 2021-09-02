import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Helmet } from "react-helmet";

import QuizContainer from './quizContainer';
import { log, takeParameterFromUrl, replaceFunction } from './base'
import PageTravel from './pageTravel';
import Header from './hotHeader';

const SearchMoreResult = () => {
    const [pageTravel, setPageTravel] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(8)
    const [offset, setOffset] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [searchValueButWithoutHyphen, setSearchValueButWithoutHyphen] = useState()
    const [matchedQuizzesCounter, setMatchedQuizzesCounter] = useState()

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
            
            const search_new_quiz_title = await axios.get(`/dbAPI/new_quiz/?title__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_quiz_title.data.results)
            
            const search_new_quiz_subCategory = await axios.get(`/dbAPI/new_quiz/?subCategory__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_quiz_subCategory.data.results)
    
            const search_new_quiz_tag = await axios.get(`/dbAPI/new_quiz/?tags__icontains=${searchValue}&limit=${numberOfResult}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_quiz_tag.data.results)
            
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
    }

    return (
        <React.Fragment>

            <Header />

            <Helmet>
                <title>{`کوییزلند | ${searchValueButWithoutHyphen} جستجو عبارت `}</title>
                <meta name="description" content="صفحه جستجو کوییزلند" />
                <meta name="keywords" content="جستجو, کوییز, کوییزلند" />
            </Helmet>

            <div className='flex flex-jc-c flex-ai-c'>
                ‌<span > ‌تعداد نتایج :‌ {matchedQuizzesCounter} </span>‌‌
                ‌<h3 className='title'> ‌ عبارت جستجو شده : {searchValueButWithoutHyphen}</h3>‌
            </div>

            {
                matchedQuizzesCounter ? 
                <ul className='quizContainer flex wrapper-med'>
                    {quizzesList}
                </ul>
                :
                // <p className='wrapper-med flex flex-jc-c flex-ai-c tx-al-c'> 🤨 هیچ نتیجه ای پیدا نشد <br/> .لطغا از عبارت دیگه ای یا به زبان دیگر (انگلیسی یا فارسی) جستجو کنید</p>
                <ul className='quizContainer flex wrapper-med'>

                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                    <li className='skeletonLoading skeletonLoading__quizContainer'></li>
                
                </ul>
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