import React, {useEffect, useState} from 'react';
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import Head from 'next/head'
import { useRouter } from 'next/router'

import QuizContainer from '../../components/quizContainer';
import QuizPointyContainer from '../../components/quizPointyContainer';
import { log, takeParameterFromUrl, replaceFunction } from '../../components/base'
import PageTravel from '../../components/pageTravel';
// import SkeletonLoading from '../../components/skeletonLoading'
import Layout from '../../components/layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const SearchMoreResult = () => {
    const router = useRouter()
    const { searchQuery } = router.query

    const [pageTravelQuizzes, setPageTravelQuizzes] = useState([])
    const [pageTravelPointy, setPageTravelPointy] = useState([])
    const [quizzesList, setQuizzesList] = useState([])
    const [pointyList, setPointyList] = useState([])
    const [numberOfResult, setNumberOfResult] = useState(16)
    const [offset, setOffset] = useState(0)
    const [searchValueButWithoutHyphen, setSearchValueButWithoutHyphen] = useState()
    const [matchedQuizzesCounter, setMatchedQuizzesCounter] = useState()
    const [matchedPointyCounter, setMatchedPointyCounter] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'overlay'
        document.querySelector('html').style=`background: None`
    }, [])

    useEffect(() => {
        getQuizzes()
        setSearchValueButWithoutHyphen(searchQuery && replaceFunction(searchQuery, '+', ' '))
    }, [searchQuery, offset])

    const axiosLimited = rateLimit(axios.create(), { maxRequests: 15, perMilliseconds: 1000, maxRPS: 150 })

    const getQuizzes = async () => {
        if (searchQuery !== '') {
            let matchedQuizzes = []
            let matchedPointy = []

            // Search Quiz
            const search_quiz_new_title = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?title__icontains=${searchQuery}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedQuizzes, search_quiz_new_title.data.results)

            if (search_quiz_new_title.length !== numberOfResult) {
                const search_quiz_new_subCategory = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?subCategory__icontains=${searchQuery}&limit=${numberOfResult * 2}&offset=${offset}`)
                Array.prototype.push.apply(matchedQuizzes, search_quiz_new_subCategory.data.results)

                if (search_quiz_new_subCategory.length !== numberOfResult * 2) {
                    const search_quiz_new_tag = await axiosLimited.get(`${API_URL}/dbAPI/quiz_new/?tags__icontains=${searchQuery}&limit=${numberOfResult * 2}&offset=${offset}`)
                    Array.prototype.push.apply(matchedQuizzes, search_quiz_new_tag.data.results)
                }
            }

            // Remove duplicated quizzes
            let uniqueMatchedQuizzes = {};

            for ( let i = 0; i < matchedQuizzes.length; i++ )
                uniqueMatchedQuizzes[matchedQuizzes[i]['title']] = matchedQuizzes[i];

            matchedQuizzes = new Array();
            for ( let key in uniqueMatchedQuizzes )
                matchedQuizzes.push(uniqueMatchedQuizzes[key]);
            
            setPageTravelQuizzes(search_quiz_new_title.data)
    
            const quizzesList = () => {
                return (
                    <QuizContainer quizzes={matchedQuizzes}/>
                )
            }
            setMatchedQuizzesCounter(matchedQuizzes.length)
            setQuizzesList([])
            setQuizzesList(quizzesList)

            // Search Pointy Quiz
            const search_pointy_new_title = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?title__icontains=${searchQuery}&limit=${numberOfResult}&offset=${offset}`)
            Array.prototype.push.apply(matchedPointy, search_pointy_new_title.data.results)

            if (search_pointy_new_title.length !== numberOfResult) {
                const search_pointy_new_subCategory = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?subCategory__icontains=${searchQuery}&limit=${numberOfResult * 2}&offset=${offset}`)
                Array.prototype.push.apply(matchedPointy, search_pointy_new_subCategory.data.results)
                
                if (search_pointy_new_subCategory !== numberOfResult * 2) {
                    const search_pointy_new_tag = await axiosLimited.get(`${API_URL}/dbAPI/pointy_new/?tags__icontains=${searchQuery}&limit=${numberOfResult * 2}&offset=${offset}`)
                    Array.prototype.push.apply(matchedPointy, search_pointy_new_tag.data.results)
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
            
            setPageTravelPointy(search_quiz_new_title.data)
    
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
        <>
            <Layout>

                <Head>
                    <title>{`کوییزلند | ${searchValueButWithoutHyphen} جستجو عبارت `}</title>
                    <meta name="description" content="صفحه جستجو کوییزلند" />
                    <meta name="keywords" content="جستجو, کوییز, کوییزلند" />
                    <meta name="robots" content="noindex, follow"></meta>
                </Head>

                <div className='flex justify-center flex-ai-c'>
                    <h3 className='title'> <span style={{fontSize: '1rem'}}>عبارت جستجو شده : <br/></span> {searchValueButWithoutHyphen}</h3>
                </div>
                
                {
                    matchedQuizzesCounter !== 0 &&
                    <>
                        <h2 className='container mx-auto px-20'>
                            کوییز های {searchValueButWithoutHyphen}
                        </h2>

                        <ul className='quizContainer flex container mx-auto px-20 space-sm'>
                            {quizzesList}
                        </ul>

                        {/* {SkeletonLoading(contentLoaded)} */}

                        <PageTravel
                            pageTravel={pageTravelQuizzes} setPageTravel={setPageTravelQuizzes}
                            numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                            offset={offset} setOffset={setOffset}
                        />
                    </>
                }

                {
                    matchedPointyCounter !== 0 &&
                    <>
                        <h2 className='container mx-auto px-20'>
                            تست های {searchValueButWithoutHyphen}
                        </h2>

                        <ul className='quizContainer flex container mx-auto px-20 space-sm'>
                            {pointyList}
                        </ul>

                        {/* {SkeletonLoading(contentLoaded)} */}

                        <PageTravel
                            pageTravel={pageTravelPointy} setPageTravel={setPageTravelPointy}
                            numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                            offset={offset} setOffset={setOffset}
                        />
                    </>
                }

            </Layout>
        </>
    );
}
 
export default SearchMoreResult;