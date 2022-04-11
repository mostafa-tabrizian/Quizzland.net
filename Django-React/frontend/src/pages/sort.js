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
    const [quizOrTest, chooseQuizOrTest] = useState();

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
        document.querySelector('#land').classList.add('overflow-y-auto')  // make content load on scroll
        
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

        let quizzesData
        
        switch (sortType) {
            // case 'newestCategory':
            //     quizzesData = await axios.get(`/api/categories/?limit=${numberOfResult}&offset=${offset}&public=true`)
            //     setSortTitle('جدیدترین کتگوری ها')
                //    setQuizzes([...quizzes, ...quizzesData.data.results]);
                // setOffset(offset + numberOfResult)
                // setLoading(false);
            //     break

            // case 'bestestCategory':
            //     quizzesData = await axios.get(`/api/categories/?&limit=${numberOfResult}&offset=${offset}&public=true`)
            //     setSortTitle('بهترین کتگوری ها')
                //    setQuizzes([...quizzes, ...quizzesData.data.results]);
                // setOffset(offset + numberOfResult)
                // setLoading(false);
            //     break

            // case 'monthlyCategory':
            //     quizzesData = await axios.get(`/api/categories/?&limit=${numberOfResult}&offset=${offset}&public=true`)
            //     setSortTitle('بهترین کتگوری های این ماه')
                //    setQuizzes([...quizzes, ...quizzesData.data.results]);
                // setOffset(offset + numberOfResult)
                // setLoading(false);
            //     break

            case 'newest':
                setLoading(true)
                chooseQuizOrTest('quiz');
                if (sortCategory) {
                    quizzesData = await axios.get(`/api/quiz_new/?limit=${numberOfResult}&offset=${offset}&category__icontains=${sortCategory}&public=true`)
                } else {
                    quizzesData = await axios.get(`/api/quiz_new/?limit=${numberOfResult}&offset=${offset}&public=true`)
                }
                setSortTitle('جدیدترین کوییز ها')
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'bestest':
                setLoading(true);
                chooseQuizOrTest('quiz')
                if (sortCategory) {
                    quizzesData = await axios.get(`/api/quiz_best/?&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}&public=true`)
                } else {
                    quizzesData = await axios.get(`/api/quiz_best/?&limit=${numberOfResult}&offset=${offset}&public=true`)
                }
                setSortTitle('بهترین کوییز ها')
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'monthly':
                setLoading(true);
                chooseQuizOrTest('quiz')
                if (sortCategory) {
                    quizzesData = await axios.get(`/api/quiz_monthly/?&category__icontains=${sortCategory}&limit=${numberOfResult}&offset=${offset}&public=true`)
                } else {
                    quizzesData = await axios.get(`/api/quiz_monthly/?&limit=${numberOfResult}&offset=${offset}&public=true`)
                }
                setSortTitle('بهترین کوییز های این ماه')
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'newest_test':
                setLoading(true)
                chooseQuizOrTest('test');
                quizzesData = await axios.get(`/api/pointy_new/?limit=${numberOfResult}&offset=${offset}&public=true`)
                
                setSortTitle('جدیدترین تست ها')
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'bestest_test':
                setLoading(true);
                chooseQuizOrTest('test')
                quizzesData = await axios.get(`/api/best_pointy_quiz/?limit=${numberOfResult}&offset=${offset}&public=true`)
                
                setQuizzes([...quizzes, ...quizzesData.data.results]);
                setSortTitle('بهترین تست ها')
                setOffset(offset + numberOfResult)
                setLoading(false);
                break

            case 'monthly_test':
                setLoading(true);
                chooseQuizOrTest('test')
                quizzesData = await axios.get(`/api/pointy_monthly/?limit=${numberOfResult}&offset=${offset}&public=true`)
                
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
                loader={
                    <div className={`
                        flex justify-center w-full
                    `}>
                        <div>
                            <svg class="animate-spin h-10 w-10 m-10 text-red-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>    
                        </div>
                    </div>
                }
                endMessage={
                    <div className='flex justify-center w-full mb-16'>
                        <h2>
                            این داستان ادامه دارد . . .
                        </h2>
                    </div>
                }
                scrollableTarget="land"
            >
                <ul className="mx-auto flex flex-wrap align-baseline w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto quizContainer flex-ai-fe justify-right">
                    {
                        quizOrTest == 'quiz' ?
                            <QuizContainer quizzes={quizzes} bgStyle='trans' />
                            :
                            <QuizPointyContainer quizzes={quizzes} bgStyle='trans' />
                    }
                </ul>   
            </InfiniteScroll>

            {/* Adverts */}

            {/* Adverts */}
            {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}
            
        </React.Fragment>
    );
}
 
export default Sort;