import React, { useEffect, useState } from 'react'

import axiosInstance from '../components/axiosApi';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom'

import InfiniteScroll from 'react-infinite-scroll-component';

import LoadingScreen from '../components/loadingScreen'
import QuizContainer from '../components/quizContainer'
import Header from '../components/header'
import Footer from '../components/footer'
import SkeletonLoading from '../components/skeletonLoading';
import Tools from '../components/tools';

import { log, takeParameterFromUrl, sortByNewest, sortByViews, sortByMonthlyViews, sortByAlphabet } from '../components/base'

const Sort = () => {
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    const [content, setContent] = useState([])
    const [sortedContent, setSortedContent] = useState([])
    const [sortType, setSortType] = useState(takeParameterFromUrl('s'))
    const [countNewFetched, setCountNewFetched] = useState()
    const [countResult, setCountResult] = useState(100)
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [useless, whenChangeThisIDKWhyTheSortAffect] = useState()

    useEffect(() => {
        componentChangeDetector()
    })

    useEffect(() => {
        setOffset(0)
        setCountResult(100)
        fetchContent()
        setLoadState(true)
        document.querySelector('#land').classList.add('overflow-y-auto')  // make content load on scroll
    }, [])

    useEffect(() => {
        sortContent()
    }, [sortType, content])

    const componentChangeDetector = () => {
        (function (history) {

            let pushState = history.pushState;
            history.pushState = function () {
                pushState.apply(history, arguments);
            };

            if (document.getElementById('html')) {
                document.getElementById('html').style = 'background: #121212'
            }

            document.getElementById('land').scrollIntoView()

        })(window.history);
    }

    const sortContent = () => {
        switch (sortType) {
            case 'newest':
                whenChangeThisIDKWhyTheSortAffect('sort1')
                setSortedContent(content.sort(sortByNewest))
                break
            case 'views':
                whenChangeThisIDKWhyTheSortAffect('sort2')
                setSortedContent(content.sort(sortByViews))
                break
            case 'trend':
                whenChangeThisIDKWhyTheSortAffect('sort3')
                setSortedContent(content.sort(sortByMonthlyViews))
                break
        }
    }

    const fetchContent = async () => {
        if (loading) {
            return;
        }

        setLoading(true)

        const quiz = await axiosInstance.get(`/api/quiz/?limit=${countResult}&offset=${offset}&public=true`)
        const pointy = await axiosInstance.get(`/api/pointy/?limit=${countResult}&offset=${offset}&public=true`)
        let content_new = quiz.data.results.concat(pointy.data.results)

        setCountNewFetched(content_new.length)

        const sortCategory = takeParameterFromUrl('c')
        if (sortCategory) {
            content_new = content_new.filter(quiz => quiz.categoryKey.id == sortCategory)
        }

        setContent([...content, ...content_new]);
        setOffset(offset + countResult)
        setLoading(false);
        setContentLoaded(true)
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

            <Tools
                sortType={sortType} setSortType={setSortType}
            />

            {SkeletonLoading(contentLoaded)}

            <InfiniteScroll
                dataLength={sortedContent.length}
                next={fetchContent}
                hasMore={countNewFetched >= 100 || countNewFetched != 0}
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

            <Footer />

        </React.Fragment>
    );
}

export default Sort;