import axios from 'axios';
import React, { useEffect, useState } from 'react'
import rateLimit from 'axios-rate-limit';
import { Helmet } from "react-helmet";

import LoadingScreen from './loadingScreen'
import PageTravel from './pageTravel'
import QuizContainer from './quizContainer'
import Header from './header'
import SkeletonLoading from './skeletonLoading'

import { log, takeParameterFromUrl } from './base'

const Sort = () => {
    const [loadState, setLoadState] = useState()
    const [quizzes, setQuizzes] = useState([])
    const [sortTitle, setSortTitle] = useState()
    const [sortType, setSortType] = useState()
    const [sortCategory, setSortCategory] = useState()
    const [pageTravel, setPageTravel] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {
        checkWhatSort()
        getQuizzes()
        listQuizzes()
        setLoadState(true)
    }, [sortType])

    useEffect(() => {
        getQuizzes()
    }, [offset])

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 15, perMilliseconds: 1000, maxRPS: 150 })

    const componentChangeDetector = () => {
        (function(history){

            let pushState = history.pushState;
            history.pushState = function() {
                pushState.apply(history, arguments);
            };

            checkWhatSort()
            document.getElementById('root').scrollIntoView()

        })(window.history);
    }
    
    const checkWhatSort = async () => {
        if (document.getElementById('html')) {
            document.getElementById('html').style=`background: None`
        }
        setSortType(takeParameterFromUrl('q'))
        setSortCategory(takeParameterFromUrl('c'))
    }

    const getQuizzes = async () => {
        let quizzes
        switch (sortType) {
            case 'newest':
                setSortTitle('جدیدترین کوییز ها')
                if (sortCategory) {
                    quizzes = await axiosLimited.get(`/dbAPI/new_quiz/?limit=${numberOfResult}&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axiosLimited.get(`/dbAPI/new_quiz/?limit=${numberOfResult}&offset=${offset}`)
                }
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'bestest':
                setSortTitle('بهترین کوییز ها')
                if (sortCategory) {
                    quizzes = await axiosLimited.get(`/dbAPI/best_quiz/?limit=21&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axiosLimited.get(`/dbAPI/best_quiz/?limit=21&limit=${numberOfResult}&offset=${offset}`)
                }
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'monthlyBestest':
                setSortTitle('بهترین کوییز های این ماه')
                if (sortCategory) {
                    quizzes = await axiosLimited.get(`/dbAPI/monthlyBest_quiz/?limit=21&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzes = await axiosLimited.get(`/dbAPI/monthlyBest_quiz/?limit=21&limit=${numberOfResult}&offset=${offset}`)
                }
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'newest_test':
                quizzes = await axiosLimited.get(`/dbAPI/new_pointy_quiz/?limit=${numberOfResult}&offset=${offset}`)
                
                setSortTitle('جدیدترین تست ها')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'bestest_test':
                quizzes = await axiosLimited.get(`/dbAPI/best_pointy_quiz/?limit=${numberOfResult}&offset=${offset}`)
                
                setSortTitle('بهترین تست ها')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            case 'monthlyBestest_test':
                quizzes = await axiosLimited.get(`/dbAPI/monthlyBest_pointy_quiz/?limit=${numberOfResult}&offset=${offset}`)
                
                setSortTitle('بهترین تست های این ماه')
                setQuizzes(quizzes.data.results)
                setPageTravel(quizzes.data)
                setContentLoaded(true)
                break

            default:
                break
        }
    }

    const listQuizzes = () => {
        return (
            <QuizContainer quizzes={quizzes} bgStyle='trans' />
        )
    }

    return (

        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>{`${sortTitle} | کوییزلند`}</title>
                <meta name="description" content="بهترین و جدید ترین کوییز و تست های کوییزلند" />
                <meta name="keywords" content="کوییز, بهترین کوییز ها, جدیدترین کوییز ها, بهترین تست ها, جدیدترین تست ها, کوییزلند" />
            </Helmet>

            <div className='adverts adverts__left'>
                <div id="pos-article-display-28432"></div>
            </div>

            <h3 className='title'>{sortTitle}</h3>

            {SkeletonLoading(contentLoaded)}
            
            <ul className="quizContainer flex wrapper-med">
                
                {listQuizzes()}

            </ul>

            <PageTravel 
                pageTravel={pageTravel} setPageTravel={setPageTravel}
                numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                offset={offset} setOffset={setOffset}
            />
            
        </React.Fragment>
    );
}
 
export default Sort;