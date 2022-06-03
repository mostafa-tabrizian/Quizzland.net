import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import InfiniteScroll from 'react-infinite-scroll-component';

import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import Header from '../components/header'
import SkeletonLoading from '../components/skeletonLoading';
import Tools from '../components/tools';

import { log, takeParameterFromUrl, sortByNewest, sortByViews, sortByMonthlyViews, sortByAlphabet } from '../components/base'

const Sort = () => {
    const [loadState, setLoadState] = useState()
    const [content, setContent] = useState([])
    const [sortedContent, setSortedContent] = useState([])
    const [sortType, setSortType] = useState()
    const [sortCategory, setSortCategory] = useState()
    const [countNewFetched, setCountNewFetched] = useState()
    const [countResult, setCountResult] = useState(100)
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {
        setOffset(0)
        setCountResult(100)
        setContent([])  // restart list
        checkWhatSort()
        fetchContent()
        setLoadState(true)
        document.querySelector('#land').classList.add('overflow-y-auto')  // make content load on scroll
    }, [sortType])

    useEffect(() => {
        sortContent()
    }, [content])

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

    const sortContent = () => {
        switch (sortType) {
            case 'newest':
                setSortedContent(content.sort(sortByNewest))
                break
            case 'bestest':
                setSortedContent(content.sort(sortByViews))
                break
            case 'trend':
                setSortedContent(content.sort(sortByMonthlyViews))
                break
            case 'alphabet':
                setSortedContent(content.sort(sortByAlphabet))
                break
        }
    }

    const fetchContent = async () => {
        if (loading) {
            return;
        }
        
        setLoading(true)

        const quiz = await axios.get(`/api/quiz/?limit=${countResult}&offset=${offset}&public=true`)
        const pointy = await axios.get(`/api/pointy/?limit=${countResult}&offset=${offset}&public=true`)
        const content_new = quiz.data.results.concat(pointy.data.results)
        
        setCountNewFetched(content_new.length)

        if (sortCategory) {
            content_new.filter(quiz => quiz.subCategory == sortCategory)
        }

        setContent([...content, ...content_new]);
        setOffset(offset + countResult)
        setLoading(false);
    }

    return (

        <React.Fragment>

            <LoadingScreen loadState={loadState} />

            <Header />

            <Helmet>
                <title>{`کوییز و تست ها | کوییزلند`}</title>
                <meta name="description" content="بهترین و جدید ترین کوییز و تست های کوییزلند" />
                <meta name="keywords" content="کوییز, بهترین کوییز ها, جدیدترین کوییز ها, بهترین تست ها, جدیدترین تست ها, کوییزلند" />
            </Helmet>

            {/* <div className='adverts adverts__left'>
                <div id='mediaad-DLgb'></div>
                <div id="pos-article-display-26094"></div>
            </div> */}

            <div className='flex space-x-12 md:space-x-24 mb-10 justify-center'>
                <Link to='/sort?s=trend'><button className={`title text-xl ${sortType == 'trend' ? 'bloodRiver' : 'hover:text-red-200'}`}>محبوب ترین</button></Link>
                <Link to='/sort?s=bestest'><button className={`title text-xl ${sortType == 'bestest' ? 'bloodRiver' : 'hover:text-red-200'}`}>پربازدیدترین</button></Link>
                <Link to='/sort?s=newest'><button className={`title text-xl ${sortType == 'newest' ? 'bloodRiver' : 'hover:text-red-200'}`}>جدیدترین</button></Link>
            </div>

            <InfiniteScroll
                dataLength={sortedContent.length}
                next={fetchContent}
                hasMore={countNewFetched >= 100 || countNewFetched!=0}
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
                    <div className='flex justify-center w-full mb-10'>
                        <h2>
                            این داستان ادامه دارد . . .
                        </h2>
                    </div>
                }
                scrollableTarget="land"
            >
                <ul className="mx-auto flex flex-wrap align-baseline w-[90vw] md:w-4/5 mr-0 ml-auto md:mx-auto quizContainer flex-ai-fe justify-right">
                    <QuizContainer quizzes={sortedContent} bgStyle='trans' />
                </ul>   
            </InfiniteScroll>

            {/* Adverts */}

            {/* Adverts */}
            {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}
            
        </React.Fragment>
    );
}
 
export default Sort;