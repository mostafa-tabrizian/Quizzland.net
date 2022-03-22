import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import InfiniteScroll from 'react-infinite-scroll-component';

import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import QuizPointyContainer from '../components/quizPointyContainer'
import Header from '../components/header'
import SkeletonLoading from '../components/skeletonLoading';

import { log, takeParameterFromUrl } from '../components/base'

const Sort = () => {
    const [loadState, setLoadState] = useState()
    const [quizzes, setQuizzes] = useState([])
    const [sortTitle, setSortTitle] = useState()
    const [sortType, setSortType] = useState()
    const [sortCategory, setSortCategory] = useState()
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {
        setOffset(0)
        setNumberOfResult(16)
        setQuizzes([])  // restart list
        checkWhatSort()
        getMoreQuiz()
        setLoadState(true)
        document.querySelector('#land').classList.add('overflow-auto')  // make content load on scroll
        
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
            document.getElementById('html').style='background: #121212'
        }
        setSortType(takeParameterFromUrl('s'))
        setSortCategory(takeParameterFromUrl('c'))
    }

    const getMoreQuiz = async () => {
        if (loading) {
            return;
        }

        // setQuizzes([])  // restart list
        let quizzesData
        
        switch (sortType) {
            // case 'newestCategory':
            //     quizzesData = await axios.get(`/api/categories/?limit=${numberOfResult}&offset=${offset}`)
            //     setSortTitle('جدیدترین کتگوری ها')
                //    setQuizzes([...quizzes, ...quizzesData.data.results]);
                // setOffset(offset + numberOfResult)
                // setLoading(false);
            //     break

            // case 'bestestCategory':
            //     quizzesData = await axios.get(`/api/categories/?&limit=${numberOfResult}&offset=${offset}`)
            //     setSortTitle('بهترین کتگوری ها')
                //    setQuizzes([...quizzes, ...quizzesData.data.results]);
                // setOffset(offset + numberOfResult)
                // setLoading(false);
            //     break

            // case 'monthlyCategory':
            //     quizzesData = await axios.get(`/api/categories/?&limit=${numberOfResult}&offset=${offset}`)
            //     setSortTitle('بهترین کتگوری های این ماه')
                //    setQuizzes([...quizzes, ...quizzesData.data.results]);
                // setOffset(offset + numberOfResult)
                // setLoading(false);
            //     break

            case 'newest':
                setLoading(true);
                if (sortCategory) {
                    quizzesData = await axios.get(`/api/quiz_new/?limit=${numberOfResult}&offset=${offset}&category__icontains=${sortCategory}`)
                } else {
                    quizzesData = await axios.get(`/api/quiz_new/?limit=${numberOfResult}&offset=${offset}`)
                }
                setSortTitle('جدیدترین کوییز ها')
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'bestest':
                setLoading(true);
                if (sortCategory) {
                    quizzesData = await axios.get(`/api/quiz_best/?&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzesData = await axios.get(`/api/quiz_best/?&limit=${numberOfResult}&offset=${offset}`)
                }
                setSortTitle('بهترین کوییز ها')
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'monthly':
                setLoading(true);
                if (sortCategory) {
                    quizzesData = await axios.get(`/api/quiz_monthly/?&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}`)
                } else {
                    quizzesData = await axios.get(`/api/quiz_monthly/?&limit=${numberOfResult}&offset=${offset}`)
                }
                setSortTitle('بهترین کوییز های این ماه')
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'newest_test':
                setLoading(true);
                quizzesData = await axios.get(`/api/pointy_new/?limit=${numberOfResult}&offset=${offset}`)
                
                setSortTitle('جدیدترین تست ها')
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'bestest_test':
                setLoading(true);
                quizzesData = await axios.get(`/api/best_pointy_quiz/?limit=${numberOfResult}&offset=${offset}`)
                
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setSortTitle('بهترین تست ها')
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'monthly_test':
                setLoading(true);
                quizzesData = await axios.get(`/api/pointy_monthly/?limit=${numberOfResult}&offset=${offset}`)
                
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setSortTitle('بهترین تست های این ماه')
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            default:
                setSortTitle('این بخش موجود نمی باشد !')
                break
        }
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

            {/* <div className='adverts adverts__left'>
                <div id='mediaad-DLgb'></div>
                <div id="pos-article-display-26094"></div>
            </div> */}

            <h3 className='title mt-5'>{sortTitle}</h3>

            {/* <ul className="mx-auto flex flex-wrap align-baseline w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto quizContainer flex-ai-fe justify-right">

                {
                    quizzes.length !== 0 && <QuizContainer quizzes={quizzes} bgStyle='trans' />
                }

                {
                    pointy.length !== 0 && <QuizPointyContainer quizzes={pointy} bgStyle='trans' />
                }

            </ul> */}

            <InfiniteScroll
                dataLength={quizzes.length}
                next={getMoreQuiz}
                hasMore={quizzes.length % 16 == 0}
                loader={'Loading...'}
                endMessage={'Im Done 😒'}
                scrollableTarget="land"
            >
                <ul className="mx-auto flex flex-wrap align-baseline w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto quizContainer flex-ai-fe justify-right">
                    <QuizContainer quizzes={quizzes} bgStyle='trans' />
                </ul>   
            </InfiniteScroll>

            {/* Adverts */}

            {/* Adverts */}
            {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}
            
        </React.Fragment>
    );
}
 
export default Sort;