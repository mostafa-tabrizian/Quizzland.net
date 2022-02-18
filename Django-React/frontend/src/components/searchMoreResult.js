import React, {useEffect, useState} from 'react';
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import { Helmet } from "react-helmet";
import Header from './header'

import QuizContainer from './quizContainer';
import QuizPointyContainer from './quizPointyContainer';
import { log, takeParameterFromUrl, replaceFunction } from './base'
import PageTravel from './pageTravel';
import SkeletonLoading from './skeletonLoading'

const SearchMoreResult = () => {
    const [pageTravelQuizzes, setPageTravelQuizzes] = useState([])
    const [pageTravelPointy, setPageTravelPointy] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [pointyList, setPointyList] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [searchValueButWithoutHyphen, setSearchValueButWithoutHyphen] = useState()
    const [matchedQuizzesCounter, setMatchedQuizzesCounter] = useState()
    const [matchedPointyCounter, setMatchedPointyCounter] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        searchChangeDetector()
    })

    useEffect(() => {
        document.body.style.overflow = 'overlay'
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
            let matchedPointy = []

            // Search Quiz
            const search_new_quiz_title = await axiosLimited.get(`/dbAPI/new_quiz/?title__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_new_quiz_title.data.results)

            if (search_new_quiz_title.length !== numberOfResult) {
                const search_new_quiz_subCategory = await axiosLimited.get(`/dbAPI/new_quiz/?subCategory__icontains=${searchValue}&limit=${numberOfResult * 2}&offset=${offset}`)
                Array.prototype.push.apply(matchedQuizzes, search_new_quiz_subCategory.data.results)

                if (search_new_quiz_subCategory.length !== numberOfResult * 2) {
                    const search_new_quiz_tag = await axiosLimited.get(`/dbAPI/new_quiz/?tags__icontains=${searchValue}&limit=${numberOfResult * 2}&offset=${offset}`)
                    Array.prototype.push.apply(matchedQuizzes, search_new_quiz_tag.data.results)
                }
            }

            // Remove duplicated quizzes
            let uniqueMatchedQuizzes = {};

            for ( let i = 0; i < matchedQuizzes.length; i++ )
                uniqueMatchedQuizzes[matchedQuizzes[i]['title']] = matchedQuizzes[i];

            matchedQuizzes = new Array();
            for ( let key in uniqueMatchedQuizzes )
                matchedQuizzes.push(uniqueMatchedQuizzes[key]);
            
            setPageTravelQuizzes(search_new_quiz_title.data)
    
            const quizzesList = () => {
                return (
                    <QuizContainer quizzes={matchedQuizzes}/>
                )
            }
            setMatchedQuizzesCounter(matchedQuizzes.length)
            setQuizzesList([])
            setQuizzesList(quizzesList)

            // Search Pointy Quiz
            const search_new_pointy_quiz_title = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?title__icontains=${searchValue}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedPointy, search_new_pointy_quiz_title.data.results)

            if (search_new_pointy_quiz_title.length !== numberOfResult) {
                const search_new_pointy_quiz_subCategory = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?subCategory__icontains=${searchValue}&limit=${numberOfResult * 2}&offset=${offset}`)
                Array.prototype.push.apply(matchedPointy, search_new_pointy_quiz_subCategory.data.results)
                
                if (search_new_pointy_quiz_subCategory !== numberOfResult * 2) {
                    const search_new_pointy_quiz_tag = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?tags__icontains=${searchValue}&limit=${numberOfResult * 2}&offset=${offset}`)
                    Array.prototype.push.apply(matchedPointy, search_new_pointy_quiz_tag.data.results)
                }
            }
            setContentLoaded(true)

            // Remove duplicated pointyQuizzes
            let uniqueMatchedPointy = {};

            for ( let i = 0; i < matchedPointy.length; i++ )
                uniqueMatchedPointy[matchedPointy[i]['title']] = matchedPointy[i];

            matchedPointy = new Array();
            for ( let key in uniqueMatchedPointy )
                matchedPointy.push(uniqueMatchedPointy[key]);
            
            setPageTravelPointy(search_new_quiz_title.data)
    
            const pointyList = () => {
                return (
                    <QuizPointyContainer quizzes={matchedPointy}/>
                )
            }

            setMatchedPointyCounter(matchedPointy.length)
            setPointyList([])
            setPointyList(pointyList)
        }

        else {
            setMatchedQuizzesCounter(0)
        }
    }

    return (
        <React.Fragment>

            <Header linkType='Hot'/>

            <Helmet>
                <title>{`کوییزلند | ${searchValueButWithoutHyphen} جستجو عبارت `}</title>
                <meta name="description" content="صفحه جستجو کوییزلند" />
                <meta name="keywords" content="جستجو, کوییز, کوییزلند" />
                <meta name="robots" content="noindex, follow"></meta>
            </Helmet>

            <div className='flex flex-jc-c flex-ai-c'>
                ‌<h3 className='title'> ‌ <span style={{fontSize: '1rem'}}>عبارت جستجو شده : <br/></span> {searchValueButWithoutHyphen}</h3>‌
            </div>
            
            {
                matchedQuizzesCounter !== 0 &&
                <React.Fragment>
                    <h2 className='wrapper-med'>
                        کوییز های {searchValueButWithoutHyphen}
                    </h2>

                    <ul className='quizContainer flex wrapper-med space-sm'>
                        {quizzesList}
                    </ul>

                    {SkeletonLoading(contentLoaded)}

                    <PageTravel
                        pageTravel={pageTravelQuizzes} setPageTravel={setPageTravelQuizzes}
                        numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                        offset={offset} setOffset={setOffset}
                    />
                </React.Fragment>
            }‌‌

            {
                matchedPointyCounter !== 0 &&
                <React.Fragment>
                    <h2 className='wrapper-med'>
                        تست های {searchValueButWithoutHyphen}
                    </h2>

                    <ul className='quizContainer flex wrapper-med space-sm'>
                        {pointyList}
                    </ul>

                    {SkeletonLoading(contentLoaded)}

                    <PageTravel
                        pageTravel={pageTravelPointy} setPageTravel={setPageTravelPointy}
                        numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                        offset={offset} setOffset={setOffset}
                    />
                </React.Fragment>
            }


        </React.Fragment>
    );
}
 
export default SearchMoreResult;