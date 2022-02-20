;
import React, { useEffect, useState } from 'react'
import axiosInstance from './axiosApi'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import LoadingScreen from './loadingScreen'
import PageTravel from './pageTravel'
import QuizContainer from './quizContainer'
import QuizPointyContainer from './quizPointyContainer'
import Header from './header'
import SkeletonLoading from './skeletonLoading'

import { log, takeParameterFromUrl } from './base'

const Sort = () => {
    const [loadState, setLoadState] = useState()
    const [quizzes, setQuizzes] = useState([])
    const [pointy, setPointy] = useState([])
    const [sortTitle, setSortTitle] = useState()
    const [sortType, setSortType] = useState()
    const [sortCategory, setSortCategory] = useState()
    const [pageTravel, setPageTravel] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {
        setPointy([])  // restart list
        setQuizzes([])  // restart list
        checkWhatSort()
        getQuizzes()
        setLoadState(true)
    }, [sortType, numberOfResult, offset])

    useEffect(() => {
        setOffset(0)
        setCurrentPageNumber(1)
        setNumberOfResult(16)
    }, [sortType])

    const componentChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            checkWhatSort()
            document.getElementById('land').scrollIntoView()

        })(window.history);
    }
    
    const checkWhatSort = async () => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
        setSortType(takeParameterFromUrl('s'))
        setSortCategory(takeParameterFromUrl('c'))
    }

    const getQuizzes = async () => {
        setQuizzes([])  // restart list
        setPointy([])  // restart list
        setContentLoaded(false)
        let quizzes
        
        switch (sortType) {
            case 'newest':
                if (sortCategory) {
                    quizzes = await axiosInstance.get(`/dbAPI/quiz_new/?limit=${numberOfResult}&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axiosInstance.get(`/dbAPI/quiz_new/?limit=${numberOfResult}&offset=${offset}`)
                }
                setSortTitle('جدیدترین کوییز ها')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'bestest':
                if (sortCategory) {
                    quizzes = await axiosInstance.get(`/dbAPI/quiz_best/?limit=21&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axiosInstance.get(`/dbAPI/quiz_best/?limit=21&limit=${numberOfResult}&offset=${offset}`)
                }
                setSortTitle('بهترین کوییز ها')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'monthly':
                if (sortCategory) {
                    quizzes = await axiosInstance.get(`/dbAPI/quiz_monthly/?limit=21&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axiosInstance.get(`/dbAPI/quiz_monthly/?limit=21&limit=${numberOfResult}&offset=${offset}`)
                }
                setSortTitle('بهترین کوییز های این ماه')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'newest_test':
                quizzes = await axiosInstance.get(`/dbAPI/pointy_new/?limit=${numberOfResult}&offset=${offset}`)
                
                setSortTitle('جدیدترین تست ها')
                setPointy(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'bestest_test':
                quizzes = await axiosInstance.get(`/dbAPI/best_pointy_quiz/?limit=${numberOfResult}&offset=${offset}`)
                
                setSortTitle('بهترین تست ها')
                setPointy(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'monthly_test':
                quizzes = await axiosInstance.get(`/dbAPI/pointy_monthly/?limit=${numberOfResult}&offset=${offset}`)
                
                setSortTitle('بهترین تست های این ماه')
                setPointy(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            default:
                setSortTitle('این بخش موجود نمی باشد !')
                setContentLoaded(true)
                break
        }
    }

    return (

        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header linkType='Link'/>

            <Helmet>
                <title>{`${sortTitle} | کوییزلند`}</title>
                <meta name="description" content="بهترین و جدید ترین کوییز و تست های کوییزلند" />
                <meta name="keywords" content="کوییز, بهترین کوییز ها, جدیدترین کوییز ها, بهترین تست ها, جدیدترین تست ها, کوییزلند" />
            </Helmet>

            <div className='adverts adverts__left'>
                <div id='mediaad-DLgb'></div>
                <div id="pos-article-display-26094"></div>
            </div>

            <h3 className='title'>{sortTitle}</h3>

            {SkeletonLoading(contentLoaded)}

            <ul className="mx-auto flex flex-wrap align-baseline w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto quizContainer flex-ai-fe justify-right">

                {
                    quizzes.length !== 0 && <QuizContainer quizzes={quizzes} bgStyle='trans' />
                }

                {
                    pointy.length !== 0 && <QuizPointyContainer quizzes={pointy} bgStyle='trans' />
                }

            </ul>

            {/* Adverts */}

            <PageTravel
                pageTravel={pageTravel} setPageTravel={setPageTravel}
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                offset={offset} setOffset={setOffset}
                currentPageNumber={currentPageNumber} setCurrentPageNumber={setCurrentPageNumber}
            />

            {/* Adverts */}
            <div className='adverts_center' id='mediaad-DLgb'></div>
            
        </React.Fragment>
    );
}
 
export default Sort;