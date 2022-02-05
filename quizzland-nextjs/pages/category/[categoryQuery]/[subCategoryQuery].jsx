import React, { useState, useEffect } from 'react';
import axios from 'axios'
import rateLimit from 'axios-rate-limit';
import Head from 'next/head'
import { useRouter } from 'next/router'

import Tools from '../../../components/tools'
import PageTravel from '../../../components/pageTravel'
import { log, replaceFunction } from '../../../components/base'
// import LoadingScreen from './loadingScreen'
import QuizContainer from '../../../components/quizContainer'
import QuizPointyContainer from '../../../components/quizPointyContainer'
import Layout from '../../../components/layout'
import SkeletonLoading from '../../../components/SkeletonLoading';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const SubCategory = () => {
    const router = useRouter()
    const { subCategoryQuery, sc } = router.query  // sc for subCategory which in persian
    
    const [pageTravelQuiz, setPageTravelQuiz] = useState([])
    const [pageTravelQuizPointy, setPageTravelQuizPointy] = useState([])

    const [quizzes, setQuizzes] = useState([])
    const [quizzesPointy, setQuizzesPointy] = useState([])

    const [hideQuizzes, setHideQuizzes] = useState(false)
    const [hideQuizzesPointy, setHideQuizzesPointy] = useState(false)

    const [numberOfResult, setNumberOfResult] = useState(2)
    const [currentPageNumberQuiz, setCurrentPageNumberQuiz] = useState(1)
    const [currentPageNumberPointy, setCurrentPageNumberPointy] = useState(1)
    
    const [offsetQuiz, setOffsetQuiz] = useState(0)
    const [offsetQuizPointy, setOffsetQuizPointy] = useState(0)
    
    const [sortType, setSortType] = useState('newest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    const sortTypeDefinitionForQuizDb = {
        'newest': 'quiz_new',
        'bestest': 'quiz_best',
        'alphabet': 'quiz_alphabet'
    }
    
    const sortTypeDefinitionForPointyQuizDb = {
        'newest': "pointy_new",
        'bestest': "pointy_best",
        'alphabet': "pointy_alphabet"
    };

    useEffect(() => {
        if (sc) {
            getQuizzes()
        }
    }, [sc, sortType, numberOfResult, offsetQuiz, offsetQuizPointy])


    useEffect(() => {
        backgroundOfSubCategory()
        setLoadState(true)
    }, [sc])

    const getQuizzes = async () => {
        const Quizzes = await axiosLimited.get(
          `${API_URL}/dbAPI/${sortTypeDefinitionForQuizDb[sortType]}/?subCategory__icontains=${subCategoryQuery && replaceFunction(subCategoryQuery, "-", " ")}&limit=${numberOfResult}&offset=${offsetQuiz}`
        );
        const QuizzesPointy = await axiosLimited.get(
          `${API_URL}/dbAPI/${sortTypeDefinitionForPointyQuizDb[sortType]}/?subCategory__icontains=${subCategoryQuery && replaceFunction(subCategoryQuery, "-", " ")}&limit=${numberOfResult}&offset=${offsetQuizPointy}`
        );
        
        if (Quizzes.data.count !== 0) {
            setQuizzes(Quizzes.data.results)
            setPageTravelQuiz(Quizzes.data)
        } else {
            setHideQuizzes(true)
        }

        if (QuizzesPointy.data.count !== 0) {
            setQuizzesPointy(QuizzesPointy.data.results)
            setPageTravelQuizPointy(QuizzesPointy.data)
        } else {
            setHideQuizzesPointy(true)
        }

        setContentLoaded(true)
    }

    const listQuizzes = () => {
        return (
            <QuizContainer quizzes={quizzes} bgStyle='bg' />
        )
    }

    const listQuizzesPointy = () => {
        return (
            <QuizPointyContainer quizzes={quizzesPointy} bgStyle='bg' />
        )
    }

    const backgroundOfSubCategory = async () => {
        if (subCategoryQuery) {
            const category_new = await axiosLimited.get(`${API_URL}/dbAPI/category_new/?subCategory__icontains=${replaceFunction(subCategoryQuery, '-', ' ')}&limit=1`)
            const background = category_new.data.results[0].background
            document.querySelector('html').style = `
                background: url('${background}') center/cover fixed no-repeat !important;
            `
        }
    }

    return (
        <>
            <Layout>

                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>{sc && `کوییزلند | کوییز های ${replaceFunction(sc, '-', ' ')}`}</title>
                    <meta name="description" content={`کوییزلند - کوییز های ${sc && replaceFunction(sc, '-', ' ')} `} />
                    <meta name="keywords" content={`بهترین کوییز های ${sc && replaceFunction(sc, '-', ' ')} , کوییز های ${sc && replaceFunction(sc, '-', ' ')}`} />
                </Head>

                {/* <div className='adverts adverts__left'>
                    Banner
                </div> */}

                <h3 className='lowTitle' style={{color: 'white'}}>{subCategoryQuery && replaceFunction(subCategoryQuery, '-', ' ')}</h3>
                <h3 className='title' style={{color: 'white'}}>{sc && replaceFunction(sc, '-', ' ')}</h3>

                <Tools 
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    sortType={sortType} setSortType={setSortType}
                />

                {SkeletonLoading(contentLoaded)}

                {
                    !(hideQuizzes) &&
                    <div>
                        {
                            !(hideQuizzesPointy) &&
                            <h2 className={`container mx-auto px-20`} style={{color: 'white'}}>کوییز ها</h2>
                        }

                        <ul className={`quizContainer flex flex-ai-fe container mx-auto md:px-20 ml-3 px-2 flex-wrap align-baseline m-2 justify-right md:m-auto`}>
                            {listQuizzes()}
                        </ul>

                        <PageTravel
                            pageTravel={pageTravelQuiz} setPageTravelQuiz={setPageTravelQuiz}
                            numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                            offset={offsetQuiz} setOffset={setOffsetQuiz}
                            currentPageNumber={currentPageNumberQuiz} setCurrentPageNumber={setCurrentPageNumberQuiz}
                        />
                    </div>
                }

                {
                    !(hideQuizzesPointy) &&
                    <div>
                        {
                            !(hideQuizzes) &&
                            <h2 className={`container mx-auto px-20`} style={{color: 'white'}}>تست ها</h2>
                        }
                        

                        <ul className={`quizContainer flex container mx-auto px-20`}>
                            {listQuizzesPointy()}
                        </ul>

                        <PageTravel
                            pageTravel={pageTravelQuizPointy} setPageTravelQuiz={setPageTravelQuizPointy}
                            numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                            offset={offsetQuizPointy} setOffset={setOffsetQuizPointy}
                            currentPageNumber={currentPageNumberPointy} setCurrentPageNumber={setCurrentPageNumberPointy}
                        />
                    </div>
                }
            </Layout>
        </>
    );
}
 
export default SubCategory;