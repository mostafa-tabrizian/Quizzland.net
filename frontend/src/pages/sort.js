import React, { useEffect, useState, useCallback } from 'react'
const axios = require('axios')
import { Helmet } from "react-helmet";
import InfiniteScroll from 'react-infinite-scroll-component'
const debounce = require('lodash.debounce')

const LoadingScreen = React.lazy(() => import('../components/loadingScreen'))
const TestContainer = React.lazy(() => import('../components/testContainer'))
const Tools = React.lazy(() => import('../components/tools'))
import { log, getTheme, takeParameterFromUrl, sortByNewest, sortByViews, sortByMonthlyViews } from '../components/base'

const Sort = () => {
    const [loadState, setLoadState] = useState()
    const [content, setContent] = useState([])
    const [sortedContent, setSortedContent] = useState([])
    const [sortType, setSortType] = useState(takeParameterFromUrl('s'))
    const [countNewFetched, setCountNewFetched] = useState()
    const [countResult, setCountResult] = useState(100)
    const [offset, setOffset] = useState(0);
    const [useless, whenChangeThisIDKWhyTheSortAffect] = useState()

    useEffect(() => {
        setOffset(0)
        setCountResult(100)
        fetchContent()
        setLoadState(true)
        
        // document.querySelector('body').style = `background: ${getTheme() == 'light' ? 'white' : '#060101'}`
        document.querySelector('body').style = `background: linear-gradient(15deg, black, #100000, #5e252b)`
        document.querySelector('#scrollme').classList.add('overflow-y-auto')  // make content load on scroll
    }, [])

    useEffect(() => {
        sortContent()
    }, [sortType, content])

    const sortContent = () => {
        setSortedContent([])
        
        setTimeout(() => {
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
        }, 100)
    }

    const fetchContent = useCallback(
        debounce(
            async () => {
                const quiz = await axios.get(`/api/quizView/?limit=${countResult}&offset=${offset}&public=true`)
                const pointy = await axios.get(`/api/testView/?limit=${countResult}&offset=${offset}&public=true`)
                let content_new = quiz.data.results.concat(pointy.data.results)
                
                setCountNewFetched(content_new.length)
        
                const sortCategory = takeParameterFromUrl('c')
                if (sortCategory) {
                    content_new = content_new.filter(quiz => quiz.categoryKey.id == sortCategory)
                }
                
                setContent([...content, ...content_new]);
                setOffset(offset + countResult)
            }, 500
        )
    )

    return (

        <React.Fragment>

            <LoadingScreen loadState={loadState} />


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

            <div id='scrollme' className='max-h-screen'>

                <InfiniteScroll
                    dataLength={sortedContent.length}
                    next={fetchContent}
                    hasMore={countNewFetched >= 100}  //  || countNewFetched != 0
                    useWindow={true}
                    loader={
                        <div className={`
                            flex justify-center w-full
                        `}>
                            <div>
                                <button onClick={fetchContent}>Load more</button>
                                <svg class="animate-spin h-10 w-10 m-10 text-red-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0100 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        </div>
                    }
                    endMessage={
                        <div className='flex justify-center w-full my-10'>
                            <h2>
                                این داستان ادامه دارد . . .
                            </h2>
                        </div>
                    }
                    scrollableTarget="scrollme"
                >
                    <ul className="mx-auto flex-col md:flex-row flex flex-wrap align-baseline w-[90vw] md:w-4/5 testContainer flex-ai-fe justify-right pt-3">
                        <TestContainer quizzes={sortedContent} bgStyle='trans' />
                    </ul>
                </InfiniteScroll>
            </div>

            {/* Adverts */}

            {/* Adverts */}
            {/* <div className='adverts_center' id='mediaad-DLgb'></div> */}

        </React.Fragment>
    );
}

export default Sort;