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

const SubCategory = () => {
    const router = useRouter()
    const { subCategoryQuery, sc } = router.query  // sc for subCategory which in persian
    const [pageTravelQuiz, setPageTravelQuiz] = useState([])
    const [pageTravelQuizPointy, setPageTravelQuizPointy] = useState([])

    const [quizzes, setQuizzes] = useState([])
    const [quizzesPointy, setQuizzesPointy] = useState([])

    const [hideQuizzes, setHideQuizzes] = useState(false)
    const [hideQuizzesPointy, setHideQuizzesPointy] = useState(false)

    const [numberOfResult, setNumberOfResult] = useState(16)
    
    const [offsetQuiz, setOffsetQuiz] = useState(0)
    const [offsetQuizPointy, setOffsetQuizPointy] = useState(0)
    
    const [sortType, setSortType] = useState('newest')
    const [loadState, setLoadState] = useState()
    const [contentLoaded, setContentLoaded] = useState(false)
    
    const axiosLimited = rateLimit(axios.create(), { maxRequests: 8, perMilliseconds: 1000, maxRPS: 150 })

    const sortTypeDefinitionForQuizDb = {
        'newest': 'new_quiz',
        'bestest': 'best_quiz',
        'alphabet': 'alphabet_quiz'
    }
    
    const sortTypeDefinitionForPointyQuizDb = {
        'newest': "new_pointy_quiz",
        'bestest': "best_pointy_quiz",
        'alphabet': "alphabet_pointy_quiz"
    };

    useEffect(() => {
        getQuizzes()
    }, [sortType, numberOfResult, offsetQuiz, offsetQuizPointy])

    useEffect(() => {
        backgroundOfSubCategory()
        setLoadState(true)
    }, [])

    const getQuizzes = async () => {
        const Quizzes = await axiosLimited.get(
          `http://localhost:8000/dbAPI/${sortTypeDefinitionForQuizDb[sortType]}/?subCategory__icontains=${replaceFunction(subCategoryQuery, "-", " ")}&limit=${numberOfResult}&offset=${offsetQuiz}`
        );
        const QuizzesPointy = await axiosLimited.get(
          `http://localhost:8000/dbAPI/${sortTypeDefinitionForPointyQuizDb[sortType]}/?subCategory__icontains=${replaceFunction(subCategoryQuery, "-", " ")}&limit=${numberOfResult}&offset=${offsetQuizPointy}`
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
        const new_category = await axiosLimited.get(`http://localhost:8000/dbAPI/new_category/?subCategory__icontains=${replaceFunction(subCategoryQuery, '-', ' ')}&limit=1`)
        const background = new_category.data.results[0].background
        document.querySelector('html').style = `
            background: url('${background}') center/cover fixed no-repeat !important;
        `
    }

    return (
        <>
            <Layout>

                {/* <LoadingScreen loadState={loadState} /> */}

                <Head>
                    <title>{`کوییزلند | کوییز های ${replaceFunction(sc, '-', ' ')}`}</title>
                    <meta name="description" content={`کوییزلند - کوییز های ${replaceFunction(sc, '-', ' ')} `} />
                    <meta name="keywords" content={`بهترین کوییز های ${replaceFunction(sc, '-', ' ')} , کوییز های ${replaceFunction(sc, '-', ' ')}`} />
                </Head>

                {/* <div className='adverts adverts__left'>
                    Banner
                </div> */}

                <h3 className='lowTitle' style={{color: 'white'}}>{replaceFunction(subCategoryQuery, '-', ' ')}</h3>
                <h3 className='title' style={{color: 'white'}}>{replaceFunction(sc, '-', ' ')}</h3>

                <Tools 
                    numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                    sortType={sortType} setSortType={setSortType}
                />

                {/* {SkeletonLoading(contentLoaded)} */}

                {
                    !(hideQuizzes) &&
                    <div>
                        {
                            !(hideQuizzesPointy) &&
                            <h2 className={`wrapper-med`} style={{color: 'white'}}>کوییز ها</h2>
                        }

                        <ul className={`quizContainer flex wrapper-med`}>
                            {listQuizzes()}
                        </ul>

                        <PageTravel
                            pageTravel={pageTravelQuiz} setPageTravelQuiz={setPageTravelQuiz}
                            numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                            offset={offsetQuiz} setOffset={setOffsetQuiz}
                        />
                    </div>
                }

                {
                    !(hideQuizzesPointy) &&
                    <div>
                        {
                            !(hideQuizzes) &&
                            <h2 className={`wrapper-med`} style={{color: 'white'}}>تست ها</h2>
                        }
                        

                        <ul className={`quizContainer flex wrapper-med`}>
                            {listQuizzesPointy()}
                        </ul>

                        <PageTravel
                            pageTravel={pageTravelQuizPointy} setPageTravelQuiz={setPageTravelQuizPointy}
                            numberOfResult={numberOfResult} setNumberOfResult={setNumberOfResult}
                            offset={offsetQuizPointy} setOffset={setOffsetQuizPointy}
                        />
                    </div>
                }
            </Layout>
        </>
    );
}
 
export default SubCategory;